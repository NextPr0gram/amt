"use client";
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import SendFoldersToErModal from "./send-folders-to-er-modal";

const SendFoldersToErDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="ml-auto">
                    Send folders to ER
                </Button>
            </DialogTrigger>
            <DialogContent>
                <SendFoldersToErModal />
            </DialogContent>
        </Dialog>
    );
};

export default SendFoldersToErDialog;
