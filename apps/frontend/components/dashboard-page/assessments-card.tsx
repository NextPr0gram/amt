"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { protectedFetch } from '@/utils/protected-fetch';
import { Separator } from '../ui/separator';
import { Loader } from '../ui/loader';
import Link from 'next/link';


export type Assessment = {
    id: number,
    name?: string,
    module: {
        code: string,
    },
    assessmentType: {
        id: number,
        name: string,
    },
    assessmentCategory: {
        id: number,
        name: string,
    },
    weight: number,
    folderId: string
};

const AssessmentsCard = () => {
    const [assessments, setAssessments] = useState<Assessment[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAssessments = async () => {
            const res = await protectedFetch("/user/assessments", "GET")
            res.status === 200 && setAssessments(res.data)
        }
        fetchAssessments()
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
                <CardTitle className="text-lg w-fit">Your assessments</CardTitle>
            </CardHeader>
            <CardContent className='text-sm'>

                {
                    assessments ? (
                        <div>
                            <Separator />
                            {
                                assessments.map((assessment) => (
                                    <div key={assessment.id}>
                                        <div className='flex justify-between py-4 px-2'>

                                            {assessment.name ? assessment.name : `${assessment.module.code} - ${assessment.assessmentCategory.name} ${assessment.assessmentType.name} weight: ${Math.round(assessment.weight * 100)}%`}

                                            <a className='hover:underline' href={"https://app.box.com/folder/" + assessment.folderId} target="_blank" rel="noopener noreferrer">View folder</a>
                                        </div>
                                        <Separator />
                                    </div>
                                ))
                            }
                        </div>
                    ) : <p >You are not in any review group</p>
                }
            </CardContent>
        </Card >
    )
}

export default AssessmentsCard
