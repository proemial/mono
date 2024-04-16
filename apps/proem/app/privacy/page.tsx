import Privacy from "./privacy";

export default function TermsPage() {
    return <div className="flex flex-col pt-20 mb-6">
        <h1>Privacy policy</h1>
        <div>
            <Privacy />
        </div>
    </div>
    // return <div className="flex flex-col gap-12">
    //     <div>
    //         <h1 className="pt-12 text-2xl font-normal">
    //             Privacy policy
    //         </h1>
    //         <p className="mt-4 text-base leading-7 text-white">
    //             Last updated on January 12, 2024
    //         </p>
    //     </div>
    //     <div>
    //         <Privacy />
    //     </div>
    // </div>
}