"use client"

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'

export default function IPv4IPv6Badge3D({ isIPv4 = true }) {
    const containerRef = useRef(null)
    const sceneRef = useRef(null)
    const modelRef = useRef(null)
    const cameraRef = useRef(null)
    const rendererRef = useRef(null)
    const mouseRef = useRef({ x: 0, y: 0, isDown: false })
    const targetRotationRef = useRef({ x: 0, y: 0 })
    const isLoadingRef = useRef(false)
    const loadModelFunctionRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) return

        const scene = new THREE.Scene()
        sceneRef.current = scene
        scene.background = null
        scene.fog = new THREE.Fog(0x0f172a, 100, 500)

        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight

        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )
        camera.position.set(0, 0, 4)
        camera.lookAt(0, 0, 0)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setClearColor(0x000000, 0)
        rendererRef.current = renderer

        containerRef.current.appendChild(renderer.domElement)

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight.position.set(10, 10, 10)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        const pointLight1 = new THREE.PointLight(0x3b82f6, 3)
        pointLight1.position.set(5, 5, 5)
        scene.add(pointLight1)

        const pointLight2 = new THREE.PointLight(0xa855f7, 2)
        pointLight2.position.set(-5, -5, 5)
        scene.add(pointLight2)

        const loadModel = (modelPath) => {
            if (isLoadingRef.current) return
            isLoadingRef.current = true

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

                    model.position.set(0, 0, 0)

                    model.traverse((node) => {
                        if (node instanceof THREE.Mesh) {
                            node.castShadow = true
                            node.receiveShadow = true
                        }
                    })

                    const previousModel = modelRef.current

                    if (previousModel) {
                        gsap.to(previousModel.rotation, {
                            y: previousModel.rotation.y + Math.PI * 2,
                            duration: 0.6,
                            ease: 'power2.inOut',
                        })
                        gsap.to({}, {
                            duration: 0.6,
                            onComplete: () => {
                                previousModel.traverse((child) => {
                                    if (child.geometry) child.geometry.dispose()
                                    if (child.material) {
                                        if (Array.isArray(child.material)) {
                                            child.material.forEach(mat => mat.dispose())
                                        } else {
                                            child.material.dispose()
                                        }
                                    }
                                })
                                scene.remove(previousModel)
                            }
                        })
                    }
                    scene.add(model)
                    modelRef.current = model

                    gsap.from(model.rotation, {
                        y: Math.PI * 2,
                        duration: 0.6,
                        ease: 'power2.inOut',
                    })

                    isLoadingRef.current = false
                },
                (progress) => {
                    const loaded = (progress.loaded / progress.total * 100).toFixed(0)
                },
                (error) => {
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
                    if (modelRef.current) {
                        scene.remove(modelRef.current)
                    }
                    scene.add(box)
                    modelRef.current = box
                    isLoadingRef.current = false
                }
            )
        }
        loadModelFunctionRef.current = loadModel

        loadModel('/models/ipv4.glb')

        const onMouseDown = (e) => {
            mouseRef.current.isDown = true
            mouseRef.current.x = e.clientX
            mouseRef.current.y = e.clientY
        }

        const onMouseMove = (e) => {
            if (!mouseRef.current.isDown || !modelRef.current) return

            const deltaX = e.clientX - mouseRef.current.x
            const deltaY = e.clientY - mouseRef.current.y

            targetRotationRef.current.y += deltaX * 0.01
            targetRotationRef.current.x += deltaY * 0.01

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
                modelRef.current.rotation.x += (targetRotationRef.current.x - modelRef.current.rotation.x) * 0.1
                modelRef.current.rotation.y += (targetRotationRef.current.y - modelRef.current.rotation.y) * 0.1
            }

            renderer.render(scene, camera)
        }
        animate()

        const handleResize = () => {
            const newWidth = containerRef.current?.clientWidth || width
            const newHeight = containerRef.current?.clientHeight || height
            camera.aspect = newWidth / newHeight
            camera.updateProjectionMatrix()
            renderer.setSize(newWidth, newHeight)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            containerRef.current?.removeEventListener('mousedown', onMouseDown)
            containerRef.current?.removeEventListener('mousemove', onMouseMove)
            containerRef.current?.removeEventListener('mouseup', onMouseUp)
            containerRef.current?.removeEventListener('mouseleave', onMouseUp)
            cancelAnimationFrame(animationId)
            if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement)
            }
            renderer.dispose()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            style={{ pointerEvents: 'auto', overflow: 'hidden' }}
        />
    )
}
