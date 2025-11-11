"use client"

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'

export default function IPv4IPv6Badge3D({ isIPv4 = true }) {
    const containerRef = useRef(null)
    const sceneRef = useRef(null)
    const cameraRef = useRef(null)
    const rendererRef = useRef(null)
    const modelRef = useRef(null)

    const mouseRef = useRef({ x: 0, y: 0, isDown: false })
    const userRotationRef = useRef({ x: 0, y: 0 })

    const isTransitioningRef = useRef(false)
    const animationRotationRef = useRef(0)
    const timelineRef = useRef(null)

    const loadingModelRef = useRef(null)

    const currentModelTypeRef = useRef(isIPv4 ? 'ipv4' : 'ipv6')

    const loadModel = (modelPath, onLoadCallback) => {
        const loader = new GLTFLoader()

        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene

                const box = new THREE.Box3().setFromObject(model)
                const center = box.getCenter(new THREE.Vector3())
                const size = box.getSize(new THREE.Vector3())

                model.traverse((child) => {
                    child.position.sub(center)
                })

                const maxDim = Math.max(size.x, size.y, size.z)
                const scale = 2.5 / maxDim
                model.scale.multiplyScalar(scale)

                model.traverse((node) => {
                    if (node instanceof THREE.Mesh) {
                        node.castShadow = true
                        node.receiveShadow = true
                    }
                })

                model.position.set(0, 0, 0)

                if (onLoadCallback) {
                    onLoadCallback(model)
                }
            },
            undefined,
            (error) => {
                console.error('Error cargando modelo:', error)
                createFallbackModel(onLoadCallback)
            }
        )
    }

    const createFallbackModel = (onLoadCallback) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 512
        canvas.height = 512
        ctx.fillStyle = '#3b82f6'
        ctx.fillRect(0, 0, 512, 512)
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 100px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('ERROR', 256, 256)

        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.MeshPhongMaterial({ map: texture })
        const geometry = new THREE.BoxGeometry(2, 2, 0.5)
        const box = new THREE.Mesh(geometry, material)

        if (onLoadCallback) {
            onLoadCallback(box)
        }
    }

    const cleanupModel = (model) => {
        if (!model) return

        model.traverse((child) => {
            if (child.geometry) {
                child.geometry.dispose()
            }
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose())
                } else {
                    child.material.dispose()
                }
            }
        })

        if (sceneRef.current) {
            sceneRef.current.remove(model)
        }
    }

    useEffect(() => {
        if (!containerRef.current) return

        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild)
        }

        const scene = new THREE.Scene()
        sceneRef.current = scene
        scene.background = null

        const width = containerRef.current.clientWidth || 800
        const height = containerRef.current.clientHeight || 600
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        camera.position.set(0, 0, 4)
        camera.lookAt(0, 0, 0)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        rendererRef.current = renderer
        containerRef.current.appendChild(renderer.domElement)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
        directionalLight.position.set(10, 10, 10)
        scene.add(directionalLight)

        const pointLight1 = new THREE.PointLight(0x3b82f6, 2.5)
        pointLight1.position.set(5, 5, 5)
        scene.add(pointLight1)

        const pointLight2 = new THREE.PointLight(0xa855f7, 1.5)
        pointLight2.position.set(-5, -5, 5)
        scene.add(pointLight2)

        const initialModelPath = isIPv4 ? '/models/ipv4.glb' : '/models/ipv6.glb'

        loadModel(initialModelPath, (model) => {
            console.log('Modelo cargado exitosamente')
            scene.add(model)
            modelRef.current = model
            currentModelTypeRef.current = isIPv4 ? 'ipv4' : 'ipv6'
        })

        const onMouseDown = (e) => {
            if (isTransitioningRef.current) return
            mouseRef.current.isDown = true
            mouseRef.current.x = e.clientX
            mouseRef.current.y = e.clientY
        }

        const onMouseMove = (e) => {
            if (!mouseRef.current.isDown || !modelRef.current || isTransitioningRef.current) return

            const deltaX = e.clientX - mouseRef.current.x
            const deltaY = e.clientY - mouseRef.current.y

            userRotationRef.current.y += deltaX * 0.01
            userRotationRef.current.x += deltaY * 0.01

            mouseRef.current.x = e.clientX
            mouseRef.current.y = e.clientY
        }

        const onMouseUp = () => {
            mouseRef.current.isDown = false
        }

        containerRef.current.addEventListener('mousedown', onMouseDown)
        containerRef.current.addEventListener('mousemove', onMouseMove)
        containerRef.current.addEventListener('mouseup', onMouseUp)
        containerRef.current.addEventListener('mouseleave', onMouseUp)

        let animationId
        const animate = () => {
            animationId = requestAnimationFrame(animate)

            if (modelRef.current) {
                if (isTransitioningRef.current) {
                    modelRef.current.rotation.y = animationRotationRef.current
                    modelRef.current.rotation.x = userRotationRef.current.x
                } else {
                    modelRef.current.rotation.x += (userRotationRef.current.x - modelRef.current.rotation.x) * 0.1
                    modelRef.current.rotation.y += (userRotationRef.current.y - modelRef.current.rotation.y) * 0.1
                }
            }

            renderer.render(scene, camera)
        }
        animate()

        const handleResize = () => {
            if (!containerRef.current || !rendererRef.current || !cameraRef.current) return
            const newWidth = containerRef.current.clientWidth || 800
            const newHeight = containerRef.current.clientHeight || 600
            cameraRef.current.aspect = newWidth / newHeight
            cameraRef.current.updateProjectionMatrix()
            rendererRef.current.setSize(newWidth, newHeight)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)

            if (containerRef.current) {
                containerRef.current.removeEventListener('mousedown', onMouseDown)
                containerRef.current.removeEventListener('mousemove', onMouseMove)
                containerRef.current.removeEventListener('mouseup', onMouseUp)
                containerRef.current.removeEventListener('mouseleave', onMouseUp)
            }

            cancelAnimationFrame(animationId)

            if (timelineRef.current) {
                timelineRef.current.kill()
            }

            cleanupModel(modelRef.current)
            cleanupModel(loadingModelRef.current)

            if (rendererRef.current) {
                rendererRef.current.dispose()
                if (containerRef.current && rendererRef.current.domElement?.parentNode === containerRef.current) {
                    containerRef.current.removeChild(rendererRef.current.domElement)
                }
            }
        }
    }, [])

    useEffect(() => {
        if (!modelRef.current || !sceneRef.current) return

        const targetModelType = isIPv4 ? 'ipv4' : 'ipv6'

        if (currentModelTypeRef.current === targetModelType) return

        if (isTransitioningRef.current) {
            if (timelineRef.current) {
                timelineRef.current.kill()
            }
        }

        isTransitioningRef.current = true

        const startRotation = modelRef.current.rotation.y

        const newModelPath = isIPv4 ? '/models/ipv4.glb' : '/models/ipv6.glb'
        loadModel(newModelPath, (newModel) => {
            loadingModelRef.current = newModel

            newModel.visible = false
            sceneRef.current.add(newModel)

            newModel.rotation.x = modelRef.current.rotation.x
            newModel.rotation.y = modelRef.current.rotation.y
        })

        const timeline = gsap.timeline({
            onComplete: () => {
                isTransitioningRef.current = false
                currentModelTypeRef.current = targetModelType
                userRotationRef.current.y = animationRotationRef.current
            }
        })

        timeline.to(animationRotationRef, {
            current: startRotation + Math.PI / 2,
            duration: 0.25,
            ease: 'power1.inOut',
            onUpdate: () => {
                if (modelRef.current) {
                    modelRef.current.rotation.y = animationRotationRef.current
                }
            }
        })

        timeline.add(() => {
            if (loadingModelRef.current && modelRef.current) {
                modelRef.current.visible = false
                loadingModelRef.current.visible = true
                loadingModelRef.current.rotation.y = animationRotationRef.current
                loadingModelRef.current.rotation.x = userRotationRef.current.x

                cleanupModel(modelRef.current)

                modelRef.current = loadingModelRef.current
                loadingModelRef.current = null
            }
        })

        timeline.to(animationRotationRef, {
            current: startRotation + Math.PI * 2,
            duration: 0.25,
            ease: 'power1.inOut',
            onUpdate: () => {
                if (modelRef.current) {
                    modelRef.current.rotation.y = animationRotationRef.current
                }
            }
        })

        timelineRef.current = timeline

    }, [isIPv4])

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            style={{ pointerEvents: 'auto', overflow: 'hidden' }}
        />
    )
}
