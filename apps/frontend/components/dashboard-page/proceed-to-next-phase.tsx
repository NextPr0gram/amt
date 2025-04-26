"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { protectedFetch } from "@/utils/protected-fetch";
import { Separator } from "../ui/separator";
import { Loader } from "../ui/loader";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface ProceesToNextPhaseCardProps {
    cname: string;
}

const ProceesToNextPhaseCard = ({ cname }: ProceesToNextPhaseCardProps) => {
    const [isTp1DeadlinesSetRes, setIsTp1DeadlinesSetRes] = useState<boolean | null>(false);
    const [isReviewGroupsFinalizedRes, setIsReviewGroupsFinalizedRes] = useState<boolean | null>(false);
    const [checkedItems, setCheckedItems] = useState({
        isTp1DeadlinesSet: false,
        isReviewGroupsFinalized: false,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIsTp1DeadlinesSet = async () => {
            const res = await protectedFetch("/moderation/deadlines/tp1-deadlines-set", "GET");
            setIsTp1DeadlinesSetRes(res.data);
        };
        const fetchIsReviewGroupsFinalized = async () => {
            const res = await protectedFetch("/review-groups/get-finalize", "GET");
            setIsReviewGroupsFinalizedRes(res.data.finalizeReviewGroups as boolean);
        };
        console.log("isTp1DeadlinesSetRes", isTp1DeadlinesSetRes);
        setCheckedItems({
            isTp1DeadlinesSet: isTp1DeadlinesSetRes ?? false,
            isReviewGroupsFinalized: isReviewGroupsFinalizedRes ?? false,
        });

        fetchIsTp1DeadlinesSet();
        fetchIsReviewGroupsFinalized();
        setIsLoading(false);
    }, [isReviewGroupsFinalizedRes, isTp1DeadlinesSetRes]);

    if (isLoading) {
        return (
            <Card className="h-60 flex justify-center items-center">
                <Loader className="mx-auto" variant="circular" />
            </Card>
        );
    }
    return (
        <Card className={cname}>
            <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-lg w-fit">Proceed to next phase</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-x-2">
                        <div className="border rounded-md p-2 hover:bg-muted/50 transition-colors flex-1">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    <div className={`h-5 w-5 rounded border flex items-center justify-center ${checkedItems.isTp1DeadlinesSet ? "bg-primary border-primary" : "border-input"}`}>{checkedItems.isTp1DeadlinesSet && <Check className="h-3.5 w-3.5 text-primary-foreground" />}</div>
                                </div>
                                <Link href="/deadlines" className="text-sm text-primary flex-grow">
                                    Check deadlines for TP1
                                </Link>
                            </div>
                        </div>
                        {!checkedItems.isTp1DeadlinesSet &&
                            (isReviewGroupsFinalizedRes ? (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm">Checked</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This action cannot be undone. After pressing checked Box folders will be created and the moderation status will procees to the next phase</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction asChild>
                                                <Button
                                                    onClick={async () => {
                                                        await protectedFetch("/moderation/deadlines/tp1-deadlines-set", "POST");

                                                        const res = await protectedFetch("/moderation/deadlines/tp1-deadlines-set", "GET");
                                                        res.status === 200 &&
                                                            setCheckedItems({
                                                                isTp1DeadlinesSet: res.data ?? false,
                                                            });
                                                    }}
                                                    size="sm"
                                                >
                                                    Checked
                                                </Button>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <Button
                                    onClick={async () => {
                                        await protectedFetch("/moderation/deadlines/tp1-deadlines-set", "POST");

                                        const res = await protectedFetch("/moderation/deadlines/tp1-deadlines-set", "GET");
                                        res.status === 200 &&
                                            setCheckedItems({
                                                isTp1DeadlinesSet: res.data ?? false,
                                            });
                                    }}
                                    size="sm"
                                >
                                    Checked
                                </Button>
                            ))}
                    </div>

                    <div className="border rounded-md p-2 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <div className={`h-5 w-5 rounded border flex items-center justify-center ${checkedItems.isReviewGroupsFinalized ? "bg-primary border-primary" : "border-input"}`}>{checkedItems.isReviewGroupsFinalized && <Check className="h-3.5 w-3.5 text-primary-foreground" />}</div>
                            </div>
                            <Link href="/review-groups" className="text-sm text-primary flex-grow">
                                Finalize review groups
                            </Link>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProceesToNextPhaseCard;
