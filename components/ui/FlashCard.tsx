'use client';

import { FlashCardType } from "@/lib/types";
import { Card, CardContent } from "./card";
import React, { useEffect, useRef, useState } from "react";

interface FlashCardProps {
    id: number;
    flashcard: FlashCardType;
    descriptionTitle?: string;
    description?: string;
}


export default function FlashCard(props: FlashCardProps) {

    const card = props.flashcard;
    const [flipped, setFlipped] = useState(false);
    const [taps, setTaps] = useState(0);

    const frontRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const animGradients = ["animated-card-gradient-1", "animated-card-gradient-2"];
        const i = Math.round(Math.random() * (animGradients.length - 1));
        const animation = animGradients[i];
        console.log("animation", animation);
        //frontRef.current?.classList.add(animation);
    }, [props.id]);

    function handleTap() {
        const newTaps = taps + 1;
        setTaps(newTaps);
        if (newTaps === 2) {
            setFlipped(!flipped);
            setTaps(0);
        }
        setTimeout(() => setTaps(0), 300);
    }

    return (
        <div
            onClick={handleTap}
            className="w-full h-full cursor-pointer flex flex-col gap-15"
            style={{ perspective: "1000px" }}
        >
            <div
                style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 300ms ease",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    position: "relative",
                    width: "100%",
                    height: "100%",
                }}
            >
                <div
                    id="front"
                    style={{ backfaceVisibility: "hidden" }}
                    className="absolute inset-0"
                >
                    <Card className={
                        `w-full h-full `
                    }
                        ref={frontRef}
                    >
                        <CardContent className="relative h-full flex items-center justify-center p-6">
                            <p className="text-center font-bold text-2xl">{card.front}</p>
                            <p className="absolute bottom-4 text-sm text-muted-foreground">
                                Double Tap To Reveal Answer
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div
                    id="back"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    className="absolute inset-0"
                >
                    <Card className="w-full h-full">
                        <CardContent className="relative h-full flex items-center justify-center p-6">
                            <p className="text-center font-bold text-2xl">{card.back}</p>
                            <p className="absolute bottom-4 text-sm text-muted-foreground">
                                Double Tap To Flip Back
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div>
                <div>{props.descriptionTitle ? props.descriptionTitle : '...'}</div>
                <div>{props.description}</div>
            </div>
        </div>
    );
}
