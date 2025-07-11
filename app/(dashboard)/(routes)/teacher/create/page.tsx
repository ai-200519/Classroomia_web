"use client";

import * as z from "zod";
import axios from "axios"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import{
    Form,
    FormControl,
    FormLabel,
    FormField,
    FormDescription,
    FormMessage,
    FormItem,

} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Le titre est requis.",
    }),
})
const CreatePage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const {isSubmitting, isValid }  = form.formState;   

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            form.reset();
            router.push(`/teacher/courses/${response.data.id}`);
            toast.success("Cursus créé avec succès !");
        } catch {
            toast.error("Une erreur s'est produite lors de la création du cursus. Veuillez réessayer plus tard.");
        }
    };


    return ( 
        <div className="max-w-5xl mx-auto flex md:items-center justify-center h-full p-6">
            <div>
                <h1 className="text-2xl font-bold">
                    Nommez votre Cursus
                </h1>
                <p className="text-slate-600 text-sm mt-2">
                Ce nom sera utilisé pour identifier le cursus dans le système.
                Vous pouvez le modifier ultérieurement si nécessaire...
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom du Cursus</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Ex: La programmation pour les nuls..." 
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-slate-800 italic">
                                        Entrez une description pour votre cursus, &apos;qu&apos;est-ce que je vais expliquer...?&apos;, etc.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href="/teacher/courses">
                                <Button type="button" variant="outline" disabled={isSubmitting}>
                                    Annuler
                                </Button>    
                            </Link>
                            <Button type="submit" disabled={isSubmitting || !isValid}>
                                Continuer
                            </Button>      
                        </div>
                    </form>   
                </Form>
            </div>
        </div>
     );
}
 
export default CreatePage;