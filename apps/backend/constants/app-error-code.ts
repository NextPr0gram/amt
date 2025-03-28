const enum AppErrorCode {
    InvalidAccessToken = "InvalidAccessToken",
    InvalidUsageOrAssignment = "InvalidUsageOrAssignment", // Error for when a value is used or assigned improperly
    FaiedToCreateBoxFolders = "FaiedToCreateBoxFolders",
    FailedToRefreshBoxToken = "FailedToRefreshBoxToken",
}

export default AppErrorCode;
