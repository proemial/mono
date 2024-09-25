import { zodResolver } from "@hookform/resolvers/zod";
import { CollectionSchema, NewCollection } from "@proemial/data/neon/schema";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Header2,
	Header4,
	Input,
	Textarea,
} from "@proemial/shadcn-ui";
import { DialogClose } from "@proemial/shadcn-ui/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";

type Props = {
	collection: NewCollection;
	onSubmit: (collection: NewCollection) => void;
	noDialog?: boolean;
};

export const CreateCollection = ({ collection, onSubmit, noDialog }: Props) => {
	const form = useForm({
		resolver: zodResolver(CollectionSchema),
		values: {
			...collection,
			description: collection.description ?? "",
		},
	});
	const router = useRouter();
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const timeout = setTimeout(() => {
			ref.current?.focus();
		}, 100);
		return () => clearTimeout(timeout);
	}, []);

	const errorStyles = form.getFieldState("name").invalid
		? "border border-red-300 border"
		: "";

	const handleSubmit = (collection: NewCollection) => {
		trackHandler(analyticsKeys.collection.createFormSubmit)();
		onSubmit(collection);
	};

	return (
		<div className="flex flex-col gap-8">
			{!noDialog && <Header2>Create New Space</Header2>}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="h-full">
					<div className="flex flex-col h-full gap-8 justify-between">
						<div className="flex flex-col gap-8">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Header4>Name</Header4>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												ref={ref}
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
										<FormLabel>
											<Header4>Description</Header4>
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Optional"
												{...field}
												className="w-full text bg-card rounded-xl px-4 resize-none min-h-32 placeholder:opacity-50"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<div className="flex justify-center">
							{noDialog ? (
								<Button
									type="submit"
									className="w-[114px]"
									onClick={() => router.back()}
								>
									Create
								</Button>
							) : (
								<DialogClose asChild>
									<Button type="submit" className="w-[114px]">
										Create
									</Button>
								</DialogClose>
							)}
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};
