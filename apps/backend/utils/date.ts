export const fifteenMinutesFromNow = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    return now;
};

export const oneYearFromNow = () => {
    const now = new Date();
    now.setFullYear(now.getFullYear() + 1);
    return now;
};

export const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
