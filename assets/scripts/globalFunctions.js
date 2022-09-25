// Helper Functions
export const globalFunctions = {

    // Get Current Page State
    getCurrentPageName: () => {
        return window.location.hash.slice(window.location.hash.lastIndexOf(`/`)).replace(`/`, ``);
    },

    // Capitalize First Letter of Every Word
    capitalizeAllWords: string => string.replace(`  `, ` `).split(` `).map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1).toLowerCase()).join(` `),

    // Cut Off Long Strings of Text & Replace with Custom Character... Also known as Truncation
    cutOffTextAndReplace: (string, end, replacement) => {
        if (!replacement) {
            replacement = `...` || `-`;
        }
        return string?.length > end ? string?.substring(0, end - 1) + replacement : string;
    },

    // Remove Duplicate Objects from Array
    removeDuplicateObjectFromArray: (arrayOfObjects) => {
        const uniqueArray = arrayOfObjects?.filter((value, index) => {
            const _value = JSON.stringify(value);
            return index === arrayOfObjects?.findIndex((obj) => {
                return JSON.stringify(obj) === _value;
            });
        });
        return uniqueArray;
    },

}