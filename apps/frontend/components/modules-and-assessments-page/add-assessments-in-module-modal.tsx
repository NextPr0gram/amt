import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { AssessmentCategory, AssessmentType } from './assessment-modal'

interface Assessment {
    id: string
    tp: "TP 1" | "TP 2"
    type: AssessmentType
    category: AssessmentCategory
    weight: number
}
const AddAssessmentsInModuleModal = () => {
    const [assessments, setAssessments] = useState<Assessment[]>([])
    const [currentAssessment, setCurrentAssessment] = useState<Assessment>()
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                    Module Assessments
                    <Badge variant="outline">{totalWeight}% of 100%</Badge>
                </CardTitle>
                <CardDescription>Add assessments for this module. Total weight must equal 100%.</CardDescription>
            </CardHeader>
            <CardContent>
                {assessments.length > 0 ? (
                    <ScrollArea className="h-[200px] rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>TP</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Weight</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assessments.map((assessment) => (
                                    <TableRow key={assessment.id}>
                                        <TableCell>{assessment.tp}</TableCell>
                                        <TableCell>{assessment.type}</TableCell>
                                        <TableCell>{assessment.category}</TableCell>
                                        <TableCell>{assessment.weight}%</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => removeAssessment(assessment.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                ) : (
                    <div className="flex items-center justify-center h-[100px] border rounded-md bg-muted/20">
                        <p className="text-sm text-muted-foreground">No assessments added yet</p>
                    </div>
                )}

                <div className="grid gap-4 mt-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="assessmentTP">TP</Label>
                            <Select
                                value={currentAssessment.tp}
                                onValueChange={(value: "TP 1" | "TP 2") => handleAssessmentChange("tp", value)}
                            >
                                <SelectTrigger id="assessmentTP">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TP 1">TP 1</SelectItem>
                                    <SelectItem value="TP 2">TP 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="assessmentType">Type</Label>
                            <Select
                                value={currentAssessment.type}
                                onValueChange={(value: AssessmentType) => handleAssessmentChange("type", value)}
                            >
                                <SelectTrigger id="assessmentType">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Exam">Exam</SelectItem>
                                    <SelectItem value="Coursework">Coursework</SelectItem>
                                    <SelectItem value="Presentation">Presentation</SelectItem>
                                    <SelectItem value="Project">Project</SelectItem>
                                    <SelectItem value="Quiz">Quiz</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="assessmentCategory">Category</Label>
                            <Select
                                value={currentAssessment.category}
                                onValueChange={(value: AssessmentCategory) => handleAssessmentChange("category", value)}
                            >
                                <SelectTrigger id="assessmentCategory">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Individual">Individual</SelectItem>
                                    <SelectItem value="Group">Group</SelectItem>
                                    <SelectItem value="Practical">Practical</SelectItem>
                                    <SelectItem value="Theory">Theory</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="assessmentWeight">Weight (%)</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="assessmentWeight"
                                    type="number"
                                    min="0"
                                    max={remainingWeight}
                                    value={currentAssessment.weight}
                                    onChange={(e) => handleAssessmentChange("weight", Number.parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="mt-2"
                        onClick={addAssessment}
                        disabled={currentAssessment.weight <= 0 || currentAssessment.weight > remainingWeight}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Assessment
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
                <div className="text-sm text-muted-foreground">
                    Remaining: <span className="font-medium">{remainingWeight}%</span>
                </div>
                {totalWeight < 100 && <div className="text-sm text-amber-500">Total weight must equal 100%</div>}
            </CardFooter>
        </Card>
    )
}

export default AddAssessmentsInModuleModal
