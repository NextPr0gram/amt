export const fifteenMinutesFromNow = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    return now;
};

export const thirtyDaysFromNow = () => {
    const now = new Date();
    now.setDate(now.getDate() + 30);
    return now;
};

export const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;