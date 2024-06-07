import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Header2,
	Header5,
	Input,
	Textarea,
} from "@proemial/shadcn-ui";
import { Plus } from "@untitled-ui/icons-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FullSizeDrawer } from "../full-page-drawer";
import { CollectionListItemHeader } from "./collection-list-item-header";

// TODO: Replace with insert type from DB
export const collectionSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
});

type Props = {
	onSubmit: (data: z.infer<typeof collectionSchema>) => void;
};

export const CreateNewCollection = ({ onSubmit }: Props) => {
	const form = useForm<z.infer<typeof collectionSchema>>({
		resolver: zodResolver(collectionSchema),
	});
	const errorStyles = form.getFieldState("name").invalid
		? "border border-red-300 border"
		: "";

	const handleSubmit = (data: z.infer<typeof collectionSchema>) => {
		onSubmit(data);
	};

	return (
		<FullSizeDrawer
			trigger={
				<CollectionListItemHeader>
					<Plus className="size-4 opacity-85" />
					<div className="text-sm">Create New Collection…</div>
				</CollectionListItemHeader>
			}
		>
			<div className="flex flex-col gap-8 h-full">
				<Header2>Create New Collection</Header2>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="h-full">
						<div className="flex flex-col h-full gap-8 justify-between">
							<div className="flex flex-col gap-8">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="opacity-50">
												<Header5>Collection name</Header5>
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													className={`w-full h-10 text bg-card rounded-full border-transparent px-4 outline-none focus-visible:ring-transparent  ${errorStyles}`}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="opacity-50">
												<Header5>Collection description</Header5>
											</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													className="w-full text bg-card rounded-xl px-4 resize-none min-h-32 placeholder:opacity-50"
													placeholder="Add a description of the collection here…"
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<div className="flex justify-center">
								<Button
									type="submit"
									className="bg-[#00AA0C]/5 text-[12px] dark:bg-primary text-[#00AA0C] dark:text-primary-foreground rounded-full w-[114px] h-10 mb-3 hover:bg-[#00AA0C]/10 dark:hover:bg-primary/90 duration-200"
								>
									Done
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</div>
		</FullSizeDrawer>
	);
};
