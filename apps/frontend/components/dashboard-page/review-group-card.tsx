"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { protectedFetch } from '@/utils/protected-fetch';
import { Separator } from '../ui/separator';
import { Loader2 } from 'lucide-react';
import { Loader } from '../ui/loader';


export type ReviewGroup = {
    id: number;
    group: string;
    year: {
        name: string;
    };
    convener: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    modules: {
        id: number;
        name: string;
        code: string;
        moduleLead: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
        };
        moduleTutors: {
            user: {
                id: number;
                firstName: string;
                lastName: string;
                email: string;
            };
        }[];
    }[];
};

const ReviewGroupCard = () => {
    const [reviewGroup, setReviewGroup] = useState<ReviewGroup | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchReviewGroup = async () => {
            const res = await protectedFetch("/user/review-group", "GET")
            res.status === 200 && setReviewGroup(res.data)
        }
        fetchReviewGroup()
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return (
            <Card className='h-60 flex justify-center items-center'>
                <Loader className="mx-auto" variant="circular" />
            </Card>
        );
    }
    return (
        <Card >
            <CardHeader className='flex flex-row justify-between'>
                <CardTitle className="text-lg w-fit">Your review group</CardTitle>
                {
                    reviewGroup ? (
                        <Badge variant="outline" className="text-sm  w-fit">
                            {reviewGroup.year.name}, Group {reviewGroup.group}
                        </Badge>
                    ) : ""
                }
            </CardHeader>
            <CardContent className='text-sm'>

                {
                    reviewGroup ? (
                        <div>
                            {
                                reviewGroup.modules.map((module) => (
                                    <div key={module.id}>
                                        <div className='flex gap-2'>
                                            <p className='text-base font-medium'>{module.name}</p>
                                            <Badge variant="outline">{module.code}</Badge>
                                        </div>
                                        <div className="mt-2 p-0 pb-4 ">
                                            Module Lead: {module.moduleLead.firstName} {module.moduleLead.lastName}

                                            <div>
                                                {
                                                    module.moduleTutors.length > 0 && (
                                                        <div>
                                                            Module Tutors:{" "}
                                                            {module.moduleTutors.map((tutor, index) => {
                                                                const tutorName = `${tutor.user.firstName} ${tutor.user.lastName}`;
                                                                // Add a comma if it's not the last tutor
                                                                return index < module.moduleTutors.length - 1 ? tutorName + ', ' : tutorName;
                                                            })}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <Separator className='mb-4' />
                                    </div>
                                ))
                            }
                            <div className='flex gap-1 pt-2'><div className='font-semibold'>Convener:</div> <div>{reviewGroup.convener.firstName} {reviewGroup.convener.lastName}</div></div>
                        </div>
                    ) : <p >You are not in any review group</p>
                }
            </CardContent>
        </Card >
    )
}

export default ReviewGroupCard
