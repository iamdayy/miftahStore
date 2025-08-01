'use client';

import { Environment, Html, OrbitControls, Text } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import type * as THREE from 'three';

type ProductBoxProps = {
    position: [number, number, number];
    color: string;
    onClick: () => void;
    isSelected: boolean;
};

function ProductBox({ position, color, onClick, isSelected }: ProductBoxProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;

            if (hovered) {
                meshRef.current.scale.setScalar(1.1);
            } else {
                meshRef.current.scale.setScalar(isSelected ? 1.05 : 1);
            }
        }
    });

    return (
        <mesh ref={meshRef} position={position} onClick={onClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={isSelected ? '#3b82f6' : color} emissive={hovered ? '#222' : '#000'} roughness={0.3} metalness={0.7} />

            {hovered && (
                <Html distanceFactor={10}>
                    <div className="rounded bg-white p-2 text-sm whitespace-nowrap text-black shadow-lg">Click to select product</div>
                </Html>
            )}
        </mesh>
    );
}

type FloatingTextProps = {
    text: string;
    position: [number, number, number];
};

function FloatingText({ text, position }: FloatingTextProps) {
    const textRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (textRef.current) {
            textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
        }
    });

    return (
        <Text ref={textRef} position={position} fontSize={0.5} color="#3b82f6" anchorX="center" anchorY="middle" font="/fonts/Inter-Bold.ttf">
            {text}
        </Text>
    );
}

export function ProductShowcase3D() {
    const [selectedProduct, setSelectedProduct] = useState(0);

    const products: { name: string; color: string; position: [number, number, number] }[] = [
        { name: 'T-Shirt', color: '#ff6b6b', position: [-2, 0, 0] },
        { name: 'Jacket', color: '#4ecdc4', position: [0, 0, 0] },
        { name: 'Shoes', color: '#45b7d1', position: [2, 0, 0] },
    ];

    return (
        <div className="h-96 w-full overflow-hidden rounded-lg bg-gradient-to-b from-gray-900 to-gray-700">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} />

                <Environment preset="studio" />

                {products.map((product, index) => (
                    <ProductBox
                        key={index}
                        position={product.position}
                        color={product.color}
                        onClick={() => setSelectedProduct(index)}
                        isSelected={selectedProduct === index}
                    />
                ))}

                <FloatingText text={products[selectedProduct].name} position={[0, 2, 0]} />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>

            <div className="absolute bottom-4 left-4 text-white">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={selectedProduct}>
                    <h3 className="text-lg font-bold">{products[selectedProduct].name}</h3>
                    <p className="text-sm opacity-75">Interactive 3D Product View</p>
                </motion.div>
            </div>
        </div>
    );
}
