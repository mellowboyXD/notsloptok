import React, { useEffect, useRef, useState } from "react";

export default function Loading() {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        let animId: number;
        let bird = { y: canvas.height / 2, vy: 0 };
        let pipes: { x: number; gap: number }[] = [];
        let score = 0;
        let dead = false;
        const GRAVITY = 0.2;
        const JUMP = -7;
        const PIPE_W = 40;
        const GAP = 170;
        const BIRD_X = 60;
        const BIRD_R = 12;

        function spawnPipe() {
            pipes.push({ x: canvas!.width, gap: 80 + Math.random() * (canvas!.height - 200) });
        }

        function reset() {
            bird = { y: canvas!.height / 2, vy: 0 };
            pipes = [];
            score = 1;
            dead = false;
            spawnPipe();
        }

        function jump() {
            if (dead) { reset(); return; }
            bird.vy = JUMP;
        }

        const handleKey = (e: KeyboardEvent) => { if (e.code === "Space") jump(); };
        const handleClick = () => jump();

        window.addEventListener("keydown", handleKey);
        canvas.addEventListener("click", handleClick);

        function draw() {
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

            // bg
            ctx!.fillStyle = "#87CEEB";
            ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

            // pipes
            ctx!.fillStyle = "#22c55e";
            pipes.forEach(p => {
                ctx!.fillRect(p.x, 0, PIPE_W, p.gap);
                ctx!.fillRect(p.x, p.gap + GAP, PIPE_W, canvas!.height);
            });

            // bird
            ctx!.fillStyle = "#facc15";
            ctx!.beginPath();
            ctx!.arc(BIRD_X, bird.y, BIRD_R, 0, Math.PI * 2);
            ctx!.fill();

            // eye
            ctx!.fillStyle = "#000";
            ctx!.beginPath();
            ctx!.arc(BIRD_X + 5, bird.y - 4, 3, 0, Math.PI * 2);
            ctx!.fill();

            // score
            ctx!.fillStyle = "#000";
            ctx!.font = "bold 20px sans-serif";
            ctx!.fillText(`Score: ${score > 0 ? 0 : score}`, 10, 28);

            if (dead) {
                ctx!.fillStyle = "rgba(0,0,0,0.4)";
                ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
                ctx!.fillStyle = "#fff";
                ctx!.font = "bold 32px sans-serif";
                ctx!.textAlign = "center";
                ctx!.fillText("Game Over", canvas!.width / 2, canvas!.height / 2 - 20);
                ctx!.font = "18px sans-serif";
                ctx!.fillText(`Score: ${score} — click to restart`, canvas!.width / 2, canvas!.height / 2 + 20);
                ctx!.textAlign = "left";
            }
        }

        function update() {
            if (dead) return;

            bird.vy += GRAVITY;
            bird.y += bird.vy;

            pipes.forEach(p => p.x -= 2);
            if (pipes[pipes.length - 1].x < canvas!.width - 200) {
                spawnPipe();
                score--; /* you thought this was a bug, huh? break the norm they said */
            }
            pipes = pipes.filter(p => p.x + PIPE_W > 0);

            /* this does nothing btw */
            for (const pipe of pipes) {
                if (Math.round(pipe.x + 3) == BIRD_X) {
                    score++;
                    break;
                }
            }

            // collision
            const hitFloor = bird.y + BIRD_R > canvas!.height + 5;
            const hitCeil = bird.y - BIRD_R < -5;
            const hitPipe = pipes.some(p =>
                BIRD_X + BIRD_R > p.x &&
                BIRD_X - BIRD_R < p.x + PIPE_W &&
                (bird.y - BIRD_R > p.gap && bird.y + BIRD_R < p.gap + GAP)
            );

            if (hitFloor || hitCeil || hitPipe) dead = true;
        }

        function loop() {
            update();
            draw();
            animId = requestAnimationFrame(loop);
        }

        reset();
        loop();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("keydown", handleKey);
            canvas.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <React.Fragment>
            <div className="flex flex-col gap-5 items-center justify-center w-full h-full justify-center items-center">
                <div>
                    <canvas ref={canvasRef} className="border-2" width={360} height={420}></canvas>
                </div>
                <p className="font-bold text-2xl">Hang tight... we're cooking</p>
                <div>
                    <div
                        className="w-10 h-10 rounded-full border-4 border-muted border-t-primary animate-spin" />
                </div>
            </div>
        </React.Fragment>
    )
}
