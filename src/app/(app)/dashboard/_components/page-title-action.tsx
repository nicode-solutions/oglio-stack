"use client";

import { Button, Tooltip } from "@lemonsqueezy/wedges";
import { PlusIcon } from "lucide-react";

export const PageTitleAction = () => {
    return (
        <Tooltip
            align="center"
            arrow={false}
            content="Add new"
            delayDuration={0}
            side="bottom"
            sideOffset={6}
        >
            <Button
                className="size-10"
                shape="pill"
                before={<PlusIcon className="size-5" />}
                onClick={() => console.log("This doesn't do anything yet.")}
            />
        </Tooltip>
    );
};
