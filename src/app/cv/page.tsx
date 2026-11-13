import { cvTitle } from "@/data/cv";

import { Frame } from "./frame";
import { Sheet } from "./sheet";

/**
 * CV page: the bento sheet rendered on the server, inside the site frame.
 * The same page is printed to /CV.pdf by scripts/cv.ts.
 *
 * @returns The rendered CV page
 */
export default function CvPage() {
    return (
        <Frame pdfName={`${cvTitle}.pdf`}>
            <Sheet />
        </Frame>
    );
}
