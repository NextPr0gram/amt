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
import { useModeration } from "../contexts/moderation-context";

interface ProceesToNextPhaseCardProps {
    cname: string;
}

const ProceesToNextPhaseCard = ({ cname }: ProceesToNextPhaseCardProps) => {
    const [isTpDeadlinesSetRes, setIsTpDeadlinesSetRes] = useState<boolean | null>(false);
    const [isReviewGroupsFinalizedRes, setIsReviewGroupsFinalizedRes] = useState<boolean | null>(false);
    const { moderationStatus } = useModeration();
    const [checkedItems, setCheckedItems] = useState({
        isTpDeadlinesSet: false,
        isReviewGroupsFinalized: false,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIsTp1DeadlinesSet = async () => {
            let res;
            if (moderationStatus?.moderationPhase?.id === 2) {
                res = await protectedFetch("/moderation/deadlines/tp1-deadlines-set", "GET");
            } else if (moderationStatus?.moderationPhase?.id === 6) {
                res = await protectedFetch("/moderation/deadlines/tp2-deadlines-set", "GET");
            }
            setIsTpDeadlinesSetRes(res.data);
        };
        const fetchIsReviewGroupsFinalized = async () => {
            const res = await protectedFetch("/review-groups/get-finalize", "GET");
            setIsReviewGroupsFinalizedRes(res.data.finalizeReviewGroups as boolean);
        };
        setCheckedItems({
            isTpDeadlinesSet: isTpDeadlinesSetRes ?? false,
            isReviewGroupsFinalized: isReviewGroupsFinalizedRes ?? false,
        });

        fetchIsTp1DeadlinesSet();
        fetchIsReviewGroupsFinalized();
        setIsLoading(false);
    }, [isReviewGroupsFinalizedRes, isTpDeadlinesSetRes, moderationStatus]);

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
                <CardTitle className="text-lg w-fit">
                    {moderationStatus?.moderationPhase?.id === 2 && "Proceed to next phase (TP1 - Internal Review)"}
                    {moderationStatus?.moderationPhase?.id === 6 && "Proceed to next phase (TP2 - Internal Review)"}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-x-2">
                        <div className="border rounded-md p-2 hover:bg-muted/50 transition-colors flex-1">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    <div className={`h-5 w-5 rounded border flex items-center justify-center ${checkedItems.isTpDeadlinesSet ? "bg-primary border-primary" : "border-input"}`}>{checkedItems.isTpDeadlinesSet && <Check className="h-3.5 w-3.5 text-primary-foreground" />}</div>
                                </div>
                                <Link href="/deadlines" className="text-sm text-primary flex-grow">
                                    {moderationStatus?.moderationPhase?.id === 2 && "Check deadlines for TP1"}
                                    {moderationStatus?.moderationPhase?.id === 6 && "Check deadlines for TP2"}
                                </Link>
                            </div>
                        </div>
                        {!checkedItems.isTpDeadlinesSet &&
                            (isReviewGroupsFinalizedRes ? (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm">Checked</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>{`This action cannot be undone. After pressing checked, ${moderationStatus?.moderationPhase?.id === 2 ? "Box folders will be created and " : ""}the moderation status will procees to the next phase`}</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction asChild>
                                                <>
                                                    {moderationStatus?.moderationPhase?.id === 2 && (
                                                        <Button
                                                            onClick={async () => {
                                                                await protectedFetch("/moderation/deadlines/tp1-deadlines-set", "POST");

                                                                const res = await protectedFetch("/moderation/deadlines/tp1-deadlines-set", "GET");
                                                                res.status === 200 &&
                                                                    setCheckedItems({
                                                                        ...checkedItems, // Keep existing state
                                                                        isTpDeadlinesSet: res.data ?? false,
                                                                    });
                                                            }}
                                                            size="sm"
                                                        >
                                                            Checked
                                                        </Button>
                                                    )}
                                                    {moderationStatus?.moderationPhase?.id === 6 && (
                                                        <Button
                                                            onClick={async () => {
                                                                await protectedFetch("/moderation/deadlines/tp2-deadlines-set", "POST");

                                                                const res = await protectedFetch("/moderation/deadlines/tp2-deadlines-set", "GET");
                                                                res.status === 200 &&
                                                                    setCheckedItems({
                                                                        ...checkedItems, // Keep existing state
                                                                        isTpDeadlinesSet: res.data ?? false,
                                                                    });
                                                            }}
                                                            size="sm"
                                                        >
                                                            Checked
                                                        </Button>
                                                    )}
                                                </>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <>
                                    {moderationStatus?.moderationPhase?.id === 2 && (
                                        <Button
                                            onClick={async () => {
                                                await protectedFetch("/moderation/deadlines/tp1-deadlines-set", "POST");

                                                const res = await protectedFetch("/moderation/deadlines/tp1-deadlines-set", "GET");
                                                res.status === 200 &&
                                                    setCheckedItems({
                                                        ...checkedItems, // Keep existing state
                                                        isTpDeadlinesSet: res.data ?? false,
                                                    });
                                            }}
                                            size="sm"
                                        >
                                            Checked
                                        </Button>
                                    )}
                                    {moderationStatus?.moderationPhase?.id === 6 && (
                                        <Button
                                            onClick={async () => {
                                                await protectedFetch("/moderation/deadlines/tp2-deadlines-set", "POST");

                                                const res = await protectedFetch("/moderation/deadlines/tp2-deadlines-set", "GET");
                                                res.status === 200 &&
                                                    setCheckedItems({
                                                        ...checkedItems, // Keep existing state
                                                        isTpDeadlinesSet: res.data ?? false,
                                                    });
                                            }}
                                            size="sm"
                                        >
                                            Checked
                                        </Button>
                                    )}
                                </>
                            ))}
                    </div>

                    {moderationStatus?.moderationPhase?.id === 2 && (
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
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProceesToNextPhaseCard;
