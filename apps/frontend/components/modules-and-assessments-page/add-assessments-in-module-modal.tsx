import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Trash2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { protectedFetch } from "@/utils/protected-fetch";
import { AssessmentCategory, AssessmentType } from "./assessment-modal";
import { ModuleAssessment } from "./module-modal";

interface AddAssessmentsInModuleModalProps {
    onAssessmentsChange: (assessments: ModuleAssessment[]) => void;
    tps: number[];
}

const AddAssessmentsInModuleModal: React.FC<AddAssessmentsInModuleModalProps> = ({ onAssessmentsChange, tps }) => {
    const [assessmentCategories, setAssessmentCategories] = useState<AssessmentCategory[]>([]);
    const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
    const [assessments, setAssessments] = useState<ModuleAssessment[]>([]);
    const [currentAssessment, setCurrentAssessment] = useState<ModuleAssessment>({
        id: "",
        tp: "",
        type: "",
        category: "",
        weight: 0,
    });

    const totalWeight = assessments.reduce((sum, assessment) => sum + assessment.weight, 0);
    const remainingWeight = 100 - totalWeight;

    useEffect(() => {
        const fetchAssessmentTypes = async () => {
            const res = await protectedFetch("/assessments/types", "GET");
            setAssessmentTypes(res.data);
        };

        const fetchAssessmentCategories = async () => {
            const res = await protectedFetch("/assessments/categories", "GET");
            setAssessmentCategories(res.data);
        };

        fetchAssessmentTypes();
        fetchAssessmentCategories();
    }, []);

    useEffect(() => {
        onAssessmentsChange(assessments);
        console.log(assessments)
    }, [assessments, onAssessmentsChange]);

    const handleAssessmentChange = (field: keyof ModuleAssessment, value: any) => {
        setCurrentAssessment((prev) => ({ ...prev, [field]: value }));
    };

    const addAssessment = () => {
        // Generate a unique ID using timestamp and random number
        const newAssessment = {
            ...currentAssessment,
            id: `${Date.now()}-${Math.random().toString(36)}`,
        };
        setAssessments((prev) => [...prev, newAssessment]);

        // Reset current assessment form
        setCurrentAssessment({
            id: "",
            tp: "",
            type: "",
            category: "",
            weight: 0,
        });
    };

    const removeAssessment = (id: string) => {
        setAssessments((prev) => prev.filter((assessment) => assessment.id !== id));
    };

    const getTPName = (tpValue: string) => {
        return tpValue === "TP 1" ? "TP 1" : "TP 2";
    };

    return (
        <Card >
            <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                    Module Assessments
                    <Badge variant="outline">{totalWeight}% of 100%</Badge>
                </CardTitle>
                <CardDescription>Add assessments for this module. Total weight must not be higher than 100%.</CardDescription>
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
                                {assessments.map((assessment) => {
                                    const tpDisplay = assessment.tp; // Already a display value like "TP 1"
                                    const typeDisplay = assessmentTypes.find((type) => type.name === assessment.type)?.name || assessment.type;
                                    const categoryDisplay = assessmentCategories.find((cat) => cat.name === assessment.category)?.name || assessment.category;

                                    return (
                                        <TableRow key={assessment.id}>
                                            <TableCell className="py-0">{tpDisplay}</TableCell>
                                            <TableCell className="py-0">{typeDisplay}</TableCell>
                                            <TableCell className="py-0">{categoryDisplay}</TableCell>
                                            <TableCell className="py-0">{assessment.weight}%</TableCell>
                                            <TableCell className="py-0">
                                                <Button variant="ghost" size="icon" onClick={() => removeAssessment(assessment.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                ) : (
                    <div className="flex items-center justify-center h-[100px] border rounded-md bg-muted/20">
                        <p className="text-sm text-muted-foreground">No assessments added yet</p>
                    </div>
                )}

                <div className="grid gap-4 mt-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <Label htmlFor="assessmentTP">TP</Label>
                            <Select value={currentAssessment.tp} onValueChange={(value) => handleAssessmentChange("tp", value)}>
                                <SelectTrigger className="h-9" id="assessmentTP">
                                    <SelectValue placeholder="Select TP" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tps.map((tp) => (
                                        <SelectItem key={tp} value={`TP ${tp}`}>
                                            TP {tp}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1">
                            <Label htmlFor="assessmentType">Type</Label>
                            <Select value={currentAssessment.type} onValueChange={(value) => handleAssessmentChange("type", value)}>
                                <SelectTrigger className="h-9" id="assessmentType">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assessmentTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.name}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1">
                            <Label htmlFor="assessmentCategory">Category</Label>
                            <Select value={currentAssessment.category} onValueChange={(value) => handleAssessmentChange("category", value)}>
                                <SelectTrigger className="h-9" id="assessmentCategory">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assessmentCategories.map((category) => (
                                        <SelectItem key={category.id} value={category.name}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1">
                            <Label htmlFor="assessmentWeight">Weight (%)</Label>
                            <div className="flex items-center gap-2">
                                <Input id="assessmentWeight" type="number" min="0" max={remainingWeight} value={currentAssessment.weight} onChange={(e) => handleAssessmentChange("weight", Number(e.target.value) || 0)} />
                            </div>
                        </div>
                    </div>

                    <Button type="button" variant="outline" className="mt-2" onClick={addAssessment} disabled={!currentAssessment.tp || !currentAssessment.type || !currentAssessment.category || currentAssessment.weight <= 0 || currentAssessment.weight > remainingWeight}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Assessment
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
                <div className="text-sm text-muted-foreground">
                    Remaining: <span className="font-medium">{remainingWeight}%</span>
                </div>
                {totalWeight < 100 && <div className="text-sm text-amber-500">Total weight must not be higher than 100%</div>}
            </CardFooter>
        </Card>
    );
};

export default AddAssessmentsInModuleModal;
