'use client';

import Container from "@/components/ui/container"
import HomeButton from "@/components/ui/home-button";
import { TiktokFrame } from "@/components/ui/tiktokframe"
import UploadButton from "@/components/ui/upload-button";
import UploadCard from "@/components/ui/upload-card"
import { useEffect, useRef, useState } from "react";
import VerticalFeed from "@/components/ui/vertical-feed";
import { UserCircleIcon } from "@phosphor-icons/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Page() {
    const [notes, setNotes] = useState("");
    const [isUploaded, setIsUploaded] = useState(false);
    const [notesData, setNotesData, deleteNotesData] = useLocalStorage("notes", "");

    const homeBtnRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setNotesData(notes);
        setIsUploaded(true);
    }, [notes])

    useEffect(() => {
        if (isUploaded)
            homeBtnRef.current?.classList.add("animate-ping");
    }, [isUploaded])

    return (
        <Container className={`animated-gradient`}>
            <TiktokFrame className="border-3 border-accent">
                <div className="">
                    <h1 className="text-3xl font-bold">Upload Your Notes</h1>
                </div>
                <div className="flex-1 w-full flex items-center justify-center p-5">
                    {/*notes ? (
                        <VerticalFeed notes={notes} />
                    ) : (
                    )*/}
                    <UploadCard onTextExtracted={setNotes} />
                </div>
                <div className="flex w-full justify-center gap-16 items-center text-4xl">
                    <div ref={homeBtnRef}>
                        <HomeButton />
                    </div>
                    <UploadButton />
                    <UserCircleIcon />
                </div>
            </TiktokFrame>
        </Container>
    )
}

