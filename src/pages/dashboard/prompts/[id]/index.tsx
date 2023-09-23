import React, { useState } from "react";
import { Typography, Box, Container, styled, Paper, Select, MenuItem, FormControl, InputLabel, IconButton, Link, Button, Toolbar, Chip, Tabs, Tab } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import PromptVersion from "~/components/prompt_version";
import PromptVariables from "~/components/prompt_variables";
import { NextPage } from "next";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import {PromptPackage as pp, PromptTemplate as pt, PromptVersion as pv} from "@prisma/client";
import { PromptVariableProps } from "~/components/prompt_variables";
import { useSession } from "next-auth/react";
import CodeHighlight from "~/components/code_highlight";
import { getAllTemplateVariables, getUniqueJsonArray } from "~/utils/template";
import { CreateTemplate } from "~/components/create_template";
import toast from 'react-hot-toast';
import PromptTemplate from "~/components/prompt_template";
import DatasetIcon from '@mui/icons-material/Dataset';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { CreateVersion } from "~/components/create_version";

const PackageShow: NextPage = () => {
    const router = useRouter();
    const packageId = router.query.id as string;

    const { data: sessionData } = useSession();
    const user = sessionData?.user

    // Load data 
    const { data: pp, refetch: rpp } = api.prompt.getPackage.useQuery({ id: packageId });
    console.log(`pp <<<<>>>> ${JSON.stringify(pp)}`);
    const [ptId, setPtId] = useState();
    const [pt, setPt] = useState<pt>();

    const { data: pts, refetch: rpt } = api.prompt.getTemplates.useQuery({ promptPackageId: packageId });
    console.log(`pts <<<<>>>> ${JSON.stringify(pts)}`);

    const handleTemplateSelection = (e: any) => {
        const id = e.target.value;
        setPtId(id)
        setPt(pts?.find((pt) => pt.id == id))
    }

    const ptCreateMutation = api.prompt.createTemplate.useMutation({
        onSuccess: (uPt) => {
            rpt();
            if (uPt !== null) {
                pts?.push(uPt)
                setPt(uPt)
                toast.success("Template Created Successfully");
            }
        }
    })

    const getColor = (version:string | null | undefined): string =>  {
        let color:string = 'error';
        if (version) {
            color = 'success'
        }

        return color;
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                {pp && (
                    <Toolbar>
                        <Typography variant="h4" component="span" sx={{ mt: 1, mb: 2 }}>
                            {pp.name} /
                        </Typography>
                        {pts && pts?.length > 0 ?
                            (
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 250 }} size="small">
                                {/* <InputLabel id="pt-selector">Select Template</InputLabel> */}
                                <Select
                                    labelId="pt-selector"
                                    label="Select Template"
                                    id="pt-selector"
                                    value={ptId}
                                    onChange={handleTemplateSelection}
                                >   
                                    {pts.map((t, index) =>(
                                        <MenuItem 
                                            key={"pt-"+index}
                                            value={t.id}
                                        >
                                            {t?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            ) : (
                            <span>
                            </span>
                        )}
                        <CreateTemplate
                            pp={pp as pp}
                            onCreate={ptCreateMutation.mutate}
                        ></CreateTemplate>
                        {pt && (<Box sx={{ flexGrow: 1 }}>
                            
                        </Box>)}
                        {pt && (<Box sx={{ display: 'inline', flexGrow: 1 }}>

                            <Paper
                                elevation={3}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'right',
                                    flexWrap: 'wrap',
                                    listStyle: 'none',
                                    p: 0.5,
                                }}
                                component="span"
                            >
                                <Box sx={{ flexGrow: 1}}>
                                    {/* <Tabs value={-1} onChange={handleTabChange}>
                                        <Tab label="Logs" icon={<DatasetIcon/>} iconPosition="start"  component={Link} href={`/dashboard/prompts/${pp.id}/logs`} />
                                        <Tab label="Insights" icon={<AnalyticsIcon/>} iconPosition="start" component={Link} href={`/dashboard/prompts/${pp.id}/analytics`} />
                                    </Tabs> */}
                                    
                                </Box>

                                <Box sx={{mt: 2, mb: 2}}>
                                    <Typography component="span" sx={{ mr: 1}}>
                                        Preview : <Chip label={pt?.previewVersion?.version || 'NA'} color={getColor(pt?.previewVersion?.version)} variant="outlined" /> 
                                    </Typography>
                                    <Typography component="span" sx={{ ml: 1 }}>
                                        Release : <Chip label={pt?.releaseVersion?.version || 'NA'} color={getColor(pt?.releaseVersion?.version)} variant="outlined" /> 
                                    </Typography>
                                </Box>
                                
                                
                            </Paper>
                            
                        </Box>)}
                        

                        
                    </Toolbar>
                )}
                <PromptTemplate pt={pt} pp={pp}></PromptTemplate>
            </Box>
        </>
    );
};

PackageShow.getLayout = getLayout

export default PackageShow;
