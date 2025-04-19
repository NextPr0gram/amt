const enum AppErrorCode {
    InvalidAccessToken = "InvalidAccessToken",
    InvalidUsageOrAssignment = "InvalidUsageOrAssignment", // Error for when a value is used or assigned improperly
    FaiedToCreateBoxFolders = "FaiedToCreateBoxFolders",
    FailedToRefreshBoxToken = "FailedToRefreshBoxToken",
    ResourceAlreadyExists = "ResourceAlreadyExists",
    NotExternalReview = "NotExternalReview",
}

export default AppErrorCode;
