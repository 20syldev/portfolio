'use client';

import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Github, Package, FolderCode, ChevronDown, Archive, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { projects, type Project } from '@/data/projects';

const INITIAL_COUNT = 8;

export function Projects() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showAll, setShowAll] = useState(false);
    const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
    const contentRef = useRef<HTMLDivElement>(null);

    const displayedProjects = showAll ? projects : projects.slice(0, INITIAL_COUNT);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [showAll]);

    return (
        <>
            <Card>
                <CardHeader className='pb-3'>
                    <CardTitle className='flex items-center justify-between text-sm font-medium'>
                        <span className='flex items-center gap-2'>
                            <FolderCode className='h-4 w-4 text-primary' />
                            Projets
                        </span>
                        <span className='text-xs text-muted-foreground'>
                            {projects.length} projets
                        </span>
                    </CardTitle>
                </CardHeader>
                <div
                    ref={contentRef}
                    className='overflow-hidden transition-[max-height] duration-500 ease-in-out'
                    style={{
                        maxHeight: showAll ? contentHeight : 400,
                    }}
                >
                    <CardContent className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4 stagger-children'>
                        {displayedProjects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                className={`relative flex flex-col gap-2 rounded-lg border p-3 text-left card-hover ${
                                    project.featured
                                        ? 'gradient-border glow-hover'
                                        : 'transition-colors hover:bg-muted/50'
                                } ${project.archived || project.paused ? 'opacity-60' : ''}`}
                            >
                                <span className='flex items-center gap-2 text-sm font-medium'>
                                    {project.name}
                                    {project.featured && (
                                        <span className='inline-block h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-pink-300' />
                                    )}
                                    {project.archived && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className='inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground'>
                                                    <Archive className='h-3 w-3' />
                                                    Archivé
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Ce projet n'est plus maintenu
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                    {project.paused && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className='inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-xs text-amber-600 dark:text-amber-400'>
                                                    <Clock className='h-3 w-3' />
                                                    WIP
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Travail en cours
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </span>
                                <span className='line-clamp-2 text-xs text-muted-foreground'>
                                    {project.description}
                                </span>
                                <div className='flex flex-wrap gap-1'>
                                    {project.tags.slice(0, 2).map((tag) => (
                                        <Badge key={tag} variant='secondary' className='text-xs px-1.5 py-0'>
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </button>
                        ))}
                    </CardContent>
                </div>
                {projects.length > INITIAL_COUNT && (
                    <div className='flex justify-center pb-4'>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setShowAll(!showAll)}
                            className='text-muted-foreground hover:text-foreground'
                        >
                            {showAll ? 'Voir moins' : `Voir tout (${projects.length - INITIAL_COUNT} de plus)`}
                            <ChevronDown
                                className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                                    showAll ? 'rotate-180' : ''
                                }`}
                            />
                        </Button>
                    </div>
                )}
            </Card>

            {/* Modal */}
            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                            {selectedProject?.name}
                            {selectedProject?.archived && (
                                <Badge variant='secondary' className='text-xs'>
                                    <Archive className='mr-1 h-3 w-3' />
                                    Archivé
                                </Badge>
                            )}
                            {selectedProject?.paused && (
                                <Badge variant='secondary' className='text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400'>
                                    <Clock className='mr-1 h-3 w-3' />
                                    WIP
                                </Badge>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedProject?.longDescription || selectedProject?.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className='flex flex-wrap gap-2'>
                        {selectedProject?.tags.map((tag) => (
                            <Badge key={tag} variant='outline'>
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className='flex flex-wrap gap-2 pt-4'>
                        {selectedProject?.github && (
                            <Button asChild size='sm' variant='outline'>
                                <a
                                    href={selectedProject.github}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <Github className='mr-2 h-4 w-4' />
                                    GitHub
                                </a>
                            </Button>
                        )}
                        {selectedProject?.demo && (
                            <Button asChild size='sm' variant='default'>
                                <a
                                    href={selectedProject.demo}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <ExternalLink className='mr-2 h-4 w-4' />
                                    Démo
                                </a>
                            </Button>
                        )}
                        {selectedProject?.npm && (
                            <Button asChild size='sm' variant='outline'>
                                <a
                                    href={selectedProject.npm}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <Package className='mr-2 h-4 w-4' />
                                    NPM
                                </a>
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}