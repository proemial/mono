import { zodResolver } from "@hookform/resolvers/zod";
import { Collection, collections } from "@proemial/data/neon/schema";
import {
	Button,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	Header2,
	Header5,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea,
} from "@proemial/shadcn-ui";
import { DialogClose } from "@proemial/shadcn-ui/components/ui/dialog";
import { createSelectSchema } from "drizzle-zod";
import { useForm } from "react-hook-form";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";

const editCollectionSchema = createSelectSchema(collections, {
	name: (schema) => schema.name.min(1).max(50),
	description: (schema) => schema.description.max(200),
});

type Props = {
	collection: Collection;
	onSubmit: (collection: Collection) => void;
};

export const EditCollection = ({ collection, onSubmit }: Props) => {
	const form = useForm({
		resolver: zodResolver(editCollectionSchema),
		values: {
			...collection,
			description: collection.description ?? "",
		},
	});

	const errorStyles = form.getFieldState("name").invalid
		? "border border-red-300 border"
		: "";

	const handleSubmit = (collection: Collection) => {
		trackHandler(analyticsKeys.collection.editFormSubmit);
		onSubmit(collection);
	};

	return (
		<div className="flex flex-col gap-8">
			<Header2>Edit Space</Header2>
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
											<Header5>Name</Header5>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												className={`w-full h-10 text bg-card rounded-full border-transparent px-4 outline-none focus-visible:ring-transparent ${errorStyles}`}
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
											<Header5>Description</Header5>
										</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												className="w-full text bg-card rounded-xl px-4 resize-none min-h-32 placeholder:opacity-50"
												placeholder="Add a description of the space here…"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="shared"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="opacity-50">
											<Header5>Shared</Header5>
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-card border-none focus:ring-transparent">
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem
													value={"private" satisfies Collection["shared"]}
												>
													Private
												</SelectItem>
												<SelectItem
													value={"organization" satisfies Collection["shared"]}
												>
													Organization
												</SelectItem>
												<SelectItem
													value={"public" satisfies Collection["shared"]}
												>
													Public
												</SelectItem>
											</SelectContent>
										</Select>
										{getSharedDescription(field.value) && (
											<FormDescription className="text-xs">
												{getSharedDescription(field.value)}
											</FormDescription>
										)}
									</FormItem>
								)}
							/>
						</div>
						<div className="flex justify-center">
							<DialogClose asChild>
								<Button
									type="submit"
									className="bg-[#00AA0C]/5 text-[12px] dark:bg-primary text-[#00AA0C] dark:text-primary-foreground rounded-full w-[114px] h-10 mb-3 hover:bg-[#00AA0C]/10 dark:hover:bg-primary/90 duration-200"
								>
									Update
								</Button>
							</DialogClose>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};

const getSharedDescription = (value: Collection["shared"]) => {
	switch (value) {
		case "private":
			return "Only you can see and edit this space.";
		case "organization":
			return "Only you and members of your organization can see and edit this space.";
		case "public":
			return "Anyone can see this space, but only you and members of your organization can edit it.";
		default:
			return undefined;
	}
};
