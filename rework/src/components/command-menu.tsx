'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
    Home,
    Briefcase,
    BookOpen,
    Github,
    Linkedin,
    Mail,
    FileText,
    Moon,
    Sun,
    Monitor,
    Search,
} from 'lucide-react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';

export function CommandMenu() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const { setTheme } = useTheme();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            {/* Search button in header */}
            <button
                onClick={() => setOpen(true)}
                className='inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
            >
                <Search className='h-4 w-4' />
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder='Rechercher...' />
                <CommandList>
                    <CommandEmpty>Aucun résultat.</CommandEmpty>

                    <CommandGroup heading='Navigation'>
                        <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
                            <Home className='mr-2 h-4 w-4' />
                            Accueil
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/alternance'))}
                        >
                            <Briefcase className='mr-2 h-4 w-4' />
                            Alternance
                        </CommandItem>
                        <CommandItem
                            onSelect={() => runCommand(() => router.push('/veille'))}
                        >
                            <BookOpen className='mr-2 h-4 w-4' />
                            Veille Technologique
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading='Projets'>
                        {projects.slice(0, 5).map((project) => (
                            <CommandItem
                                key={project.id}
                                onSelect={() =>
                                    runCommand(() => window.open(project.demo || project.github, '_blank'))
                                }
                            >
                                <span className='mr-2'>🚀</span>
                                {project.name}
                                <span className='ml-2 text-xs text-muted-foreground'>
                                    {project.description.slice(0, 40)}...
                                </span>
                            </CommandItem>
                        ))}
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading='Liens'>
                        <CommandItem
                            onSelect={() =>
                                runCommand(() => window.open(profile.links.github, '_blank'))
                            }
                        >
                            <Github className='mr-2 h-4 w-4' />
                            GitHub
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                runCommand(() => window.open(profile.links.linkedin, '_blank'))
                            }
                        >
                            <Linkedin className='mr-2 h-4 w-4' />
                            LinkedIn
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                runCommand(() => window.open(`mailto:${profile.links.email}`))
                            }
                        >
                            <Mail className='mr-2 h-4 w-4' />
                            Contact
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                runCommand(() => window.open(profile.links.cv, '_blank'))
                            }
                        >
                            <FileText className='mr-2 h-4 w-4' />
                            CV
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading='Thème'>
                        <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
                            <Sun className='mr-2 h-4 w-4' />
                            Thème clair
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
                            <Moon className='mr-2 h-4 w-4' />
                            Thème sombre
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
                            <Monitor className='mr-2 h-4 w-4' />
                            Thème système
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}