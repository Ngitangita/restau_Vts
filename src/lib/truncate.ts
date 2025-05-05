export const truncate = (description: string, maxLength: number): string => {
    if (description.length <= maxLength)
        return description;

    let truncated = description.slice(0, maxLength);
    let lastSpaceIndex = truncated.lastIndexOf(" ");

    if (lastSpaceIndex === -1) {
        return truncated.slice(0, maxLength) + "...";
    }

    return truncated.slice(0, lastSpaceIndex) + "...";
};

