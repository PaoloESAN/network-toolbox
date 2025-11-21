"use client"

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

export default function Logos3D({ isIPv4 = true }) {
    const containerRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isMounted, setIsMounted] = useState(false)

    const sceneRef = useRef(null)
    const cameraRef = useRef(null)
    const rendererRef = useRef(null)
    const controlsRef = useRef(null)
    const textMeshRef = useRef(null)
    const particlesMeshRef = useRef(null)
    const mouseLightRef = useRef(null)
    const pointLight1Ref = useRef(null)
    const pointLight2Ref = useRef(null)
    const fontRef = useRef(null)

    const mouseRef = useRef(new THREE.Vector2())
    const targetRef = useRef(new THREE.Vector2())
    const windowHalfRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!containerRef.current || !isMounted) return

        const scene = new THREE.Scene()
        sceneRef.current = scene

        const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000)
        camera.position.set(0, 0, 30)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            premultipliedAlpha: false
        })
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.toneMapping = THREE.ReinhardToneMapping
        renderer.setClearColor(0x000000, 0)
        containerRef.current.appendChild(renderer.domElement)
        rendererRef.current = renderer

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.autoRotate = true
        controls.autoRotateSpeed = 1.0
        controls.enablePan = false
        controlsRef.current = controls

        const ambientLight = new THREE.AmbientLight(0x404040, 1)
        scene.add(ambientLight)

        const pointLight1 = new THREE.PointLight(0x00ffff, 2, 100)
        pointLight1.position.set(10, 10, 10)
        scene.add(pointLight1)
        pointLight1Ref.current = pointLight1

        const pointLight2 = new THREE.PointLight(0xff00ff, 2, 100)
        pointLight2.position.set(-10, -10, 10)
        scene.add(pointLight2)
        pointLight2Ref.current = pointLight2

        const mouseLight = new THREE.PointLight(0xffffff, 1, 50)
        scene.add(mouseLight)
        mouseLightRef.current = mouseLight

        const particlesGeometry = new THREE.BufferGeometry()
        const particlesCount = 700
        const posArray = new Float32Array(particlesCount * 3)

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 80
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.15,
            color: 0x00ffcc,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        })
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
        scene.add(particlesMesh)
        particlesMeshRef.current = particlesMesh

        windowHalfRef.current.x = containerRef.current.clientWidth / 2
        windowHalfRef.current.y = containerRef.current.clientHeight / 2

        const handleMouseMove = (event) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            const halfX = rect.width / 2
            const halfY = rect.height / 2

            mouseRef.current.x = (x - halfX)
            mouseRef.current.y = (y - halfY)
        }

        containerRef.current.addEventListener('mousemove', handleMouseMove)

        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
            const width = containerRef.current.clientWidth
            const height = containerRef.current.clientHeight

            windowHalfRef.current.x = width / 2
            windowHalfRef.current.y = height / 2

            cameraRef.current.aspect = width / height
            cameraRef.current.updateProjectionMatrix()
            rendererRef.current.setSize(width, height)
        }
        window.addEventListener('resize', handleResize)

        const clock = new THREE.Clock()
        let animationId

        const animate = () => {
            animationId = requestAnimationFrame(animate)
            const elapsedTime = clock.getElapsedTime()

            if (controlsRef.current) controlsRef.current.update()

            if (pointLight1Ref.current) {
                pointLight1Ref.current.position.x = Math.sin(elapsedTime * 0.7) * 20
                pointLight1Ref.current.position.z = Math.cos(elapsedTime * 0.7) * 20
                pointLight1Ref.current.position.y = Math.sin(elapsedTime * 0.3) * 10
            }

            if (pointLight2Ref.current) {
                pointLight2Ref.current.position.x = Math.sin(elapsedTime * 0.5 + Math.PI) * 20
                pointLight2Ref.current.position.z = Math.cos(elapsedTime * 0.5 + Math.PI) * 20
            }

            if (mouseLightRef.current) {
                targetRef.current.x = mouseRef.current.x * 0.05
                targetRef.current.y = -mouseRef.current.y * 0.05
                mouseLightRef.current.position.x += (targetRef.current.x - mouseLightRef.current.position.x) * 0.1
                mouseLightRef.current.position.y += (targetRef.current.y - mouseLightRef.current.position.y) * 0.1
                mouseLightRef.current.position.z = 15
            }

            if (particlesMeshRef.current) {
                particlesMeshRef.current.rotation.y = elapsedTime * 0.05
                particlesMeshRef.current.rotation.x = elapsedTime * 0.02
            }

            renderer.render(scene, camera)
        }

        animate()

        const loader = new FontLoader()
        loader.load('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json', function (font) {
            fontRef.current = font
            setIsLoading(false)
        })

        return () => {
            window.removeEventListener('resize', handleResize)
            if (containerRef.current) {
                containerRef.current.removeEventListener('mousemove', handleMouseMove)
                if (rendererRef.current && rendererRef.current.domElement && containerRef.current.contains(rendererRef.current.domElement)) {
                    containerRef.current.removeChild(rendererRef.current.domElement)
                }
            }
            cancelAnimationFrame(animationId)
            if (rendererRef.current) rendererRef.current.dispose()
            if (sceneRef.current) {
                sceneRef.current.traverse((object) => {
                    if (object.geometry) object.geometry.dispose()
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose())
                        } else {
                            object.material.dispose()
                        }
                    }
                })
            }
        }
    }, [isMounted])

    useEffect(() => {
        if (!fontRef.current || !sceneRef.current) return

        const textString = isIPv4 ? 'IPv4' : 'IPv6'

        // Remove old text
        if (textMeshRef.current) {
            sceneRef.current.remove(textMeshRef.current)
            textMeshRef.current.geometry.dispose()
            if (Array.isArray(textMeshRef.current.material)) {
                textMeshRef.current.material.forEach(m => m.dispose())
            } else {
                textMeshRef.current.material.dispose()
            }
        }

        const textGeo = new TextGeometry(textString, {
            font: fontRef.current,
            size: 6,
            depth: 2,
            height: 1.5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5
        })

        textGeo.computeBoundingBox()
        const centerOffset = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
        textGeo.translate(centerOffset, -3, 0)

        const materialFront = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a2e,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x0a0a1a,
            emissiveIntensity: 0.3,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        })

        const materialSide = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 1.5,
            metalness: 1,
            roughness: 0.1
        })

        const textMesh = new THREE.Mesh(textGeo, [materialFront, materialSide])

        textMesh.scale.set(0, 0, 0)
        sceneRef.current.add(textMesh)
        textMeshRef.current = textMesh

        gsap.to(textMesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
        })

        gsap.from(textMesh.rotation, {
            y: Math.PI * 2,
            duration: 1,
            ease: "power2.out"
        })

    }, [isIPv4, isLoading])

    if (!isMounted) {
        return <div style={{ width: '100%', height: '100%', display: 'block' }} />
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#00ffcc',
                    fontSize: '1.2rem',
                    letterSpacing: '2px',
                    pointerEvents: 'none',
                    transition: 'opacity 0.5s ease',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px #00ffcc',
                    zIndex: 10
                }}>
                    Cargando Activos 3D...
                </div>
            )}
            <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
    )
}
