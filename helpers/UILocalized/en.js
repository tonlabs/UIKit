// @flow

import type { UILocalizedData } from './UILocalizedTypes';

const en: UILocalizedData = {
    // TON
    TONLabel: 'TON',
    CopyRight: `2018–${(new Date()).getFullYear()} © TON Labs`,
    Disclaimer: 'Disclaimer',

    // Terms
    TermsCookiesPolicy: 'By using this website you agree to our Cookies Policy.',
    Here: 'here',
    LegalNotes: 'Legal Notes',

    // Login
    Login: 'Login',
    WeNeedYourPhoneNumber: 'To identify you we need your\nphone number',
    PhoneNumber: 'Phone Number',
    BankCardNumber: 'Card number',
    TermsButtonText: 'By signing up you agree to the Terms of Service',
    GetCode: 'Get code',
    WeHaveSentYouACode: 'We sent you a code to verify your phone number',
    Code: 'Code',
    HaveNotReceivedTheCode: 'Haven\'t received the code?',
    CheckingTheCode: 'Checking the code...',
    InvalidPhoneNumber: 'Invalid phone number',
    InvalidContractAddress: 'Invalid contract-address',
    SmartContractAddress: 'Smart-contract address',
    InvalidCode: 'Invalid code',
    InvalidFirstName: 'Invalid first name',
    InvalidLastName: 'Invalid last name',
    InvalidUsername: 'Invalid username',
    InvalidPassword: 'Invalid password',
    InvalidEmail: 'Invalid email address',
    InvalidPhone: 'Invalid phone',
    InvalidDate: 'Invalid date',
    InvalidBankCardNumber: 'Invalid card number',
    YouHaveEnteredAnInvalidPhoneNumber: 'You have entered an invalid phone number',
    YouHaveEnteredAnEmptyCodeFor: 'You have entered an empty code for',
    YouHaveEnteredAnExpiredCodeFor: 'You have entered an expired code for',
    YouHaveEnteredAnInvalidCodeFor: 'You have entered an invalid code for',
    YouHaveEnteredAnInvalidFirstNameFor: 'You have entered an invalid first name for',
    YouHaveEnteredAnInvalidLastNameFor: 'You have entered an invalid last name for',
    YouHaveEnteredAnUnacceptableUsername: 'You have entered an unacceptable username',
    YouHaveEnteredAUsernameWhichIsAlreadyTaken: 'You have entered a username which is already taken',
    YouHaveEnteredAUsernameWhichIsNotDifferent: 'You have entered a username which is not different from the current username',
    LimitExceededFor: 'Limit exceeded for',
    PleaseTryLater: 'Please try later',
    PleaseTryAgain: 'Please try again',
    YouCanRequestTheCodeAgain: 'You can request the code again',
    WhatIsYourName: 'What is your name?',
    CreateAUsername: 'Create a username',
    AddAProfilePicture: 'Add a profile picture',
    StartMessaging: 'Start messaging',
    // Login (Telegram translations)
    Login_PhoneFloodError: 'Sorry, you have deleted and re-created your account too many times recently. Please wait a few days before signing up again.',
    Login_PhoneBannedError: 'Your phone number was banned.',

    // System
    Warning: 'Warning',
    Error: 'Error',
    Success: 'Success',
    Cancel: 'Cancel',
    Done: 'Done',
    Continue: 'Continue',
    Close: 'Close',
    Add: 'Add',
    Edit: 'Edit',
    Delete: 'Delete',
    Manage: 'Manage',
    OK: 'OK',
    Create: 'Create',
    Search: 'Search',
    Import: 'Import',
    NotFound: 'Not found',
    Yes: 'Yes',
    No: 'No',
    Copy: 'Copy',
    CopyToClipboard: 'Copy to clipboard',
    Select: 'Select',
    SelectAll: 'Select All',
    DeselectAll: 'Deselect All',
    TakePhoto: 'Take photo',
    TakeVideo: 'Take video',
    ChooseFromLibrary: 'Choose from Library',
    NotDefined: 'Not defined',
    NotChosen: 'Not chosen',
    Next: 'Next',
    Prev: 'Prev',
    Upload: 'Upload',
    Submit: 'Submit',
    Download: 'Download',
    Update: 'Update',
    Value: 'Value',
    Hide: 'Hide',
    Skip: 'Skip',
    In: 'in',
    Sec: 'sec.',
    Description: 'Description',
    Share: 'Copy & Share This Link',
    ShareToTalk: 'Your TON wallet address link to allow friends to talk and make transactions with you.',
    ShareLink: 'Share Link',
    Report: 'Report',
    PleaseDoNotCloseTheApp: 'Please do not close the app',
    ThisActionCannotBeUndone: 'This action cannot be undone',
    SomethingWentWrong: 'Something went wrong. Please try again later.',
    NewVersionIsAvailable: 'New version is available',
    PleaseUpdate: 'Please update',
    ForgotPassword: 'Forgot password?',
    LoadMore: 'Load more',
    YouMustUseThePhoneNumberSpecifiedInTheOffer: 'You must use the phone number specified in the offer',
    ConnectionStatus: 'Connection status',
    ConnectionHasBeenLost: 'Connection has been lost',
    SorryWeCannotDoActionAtTheMoment: 'Sorry we cannot {0} at the moment 😿. Please, try again later.',
    NumberCopiedToClipboard: 'Number copied to clipboard.',
    LinkCopiedToClipboard: 'Link copied to clipboard.',
    MessageCopiedToClipboard: 'Message copied to clipboard.',
    HashCopiedToClipboard: 'Hash copied to clipboard.',
    FileIsTooBig: 'Sorry we cannot process this. File is too big (max: {0} MB).',
    Important: 'IMPORTANT!',
    UserIsNotAuthorized: 'User is not authorized',
    WalletIsNotInitialized: 'Wallet is not initialized',
    WeAreSorryButYourBrowserVersionIsNotCompatible: 'We are sorry but your browser version is not compatible with our application.\nPlease use any modern browser instead (Chrome, Safari, Edge, Firefox, etc.).',
    PleaseGoOnline: 'Please go online',

    // Profile
    Profile: 'Profile',
    EditProfile: 'Edit Profile',
    LogOut: 'Log out',
    Name: 'Name',
    Details: 'Details',
    GivenNames: 'Given names',
    Surname: 'Surname',
    Username: 'Username',
    UploadAvatar: 'Upload photo',
    DoYouWantToLogOut: 'Do you want to log out?',
    Addresses: 'Addresses',
    BackupAccount: 'Backup account',

    EnterYouNameAndProfilePicture: 'Enter your name and add a profile picture.',
    AnyDetailsSuchAsAge: 'Any details such as age, occupation or city.\nExample: 23 y.o. designer from San Francisco.',
    YourUsername: 'Your username',
    UpdateUsername: 'Update Username',
    EditUsernameInstructions: 'You can choose a username. If you do, other people will be able to find you by this username and contact you without knowing you phone number.\n\nYou can use a–z, 0–9 and underscores. Minimum length is 5 characters.',
    ThisLinkOpensChat: 'This link opens a chat with you',

    TelegramCall: 'Telegram Call',
    PhoneCall: 'Phone Call',
    WeWillSendAnSMSWithConfirmationCode: 'We will send an SMS text with a confirmation code to your new phone number',

    ChangeNumber: 'Change Number',
    CopyNumber: 'Copy Number',
    EnterYourNewPhoneNumber: 'Enter your new phone number',
    EditPhoneNumberInstructions: 'You can change your phone number here. Your account and all your cloud data — messages, media, contacts, etc. will be moved to the new number.\n\nImportant: all your contacts will get your new number added to their address book provided they had your old number and you haven`t blocked them.',

    FromCamera: 'From Camera',
    FromGallery: 'From Gallery',
    DeletePhoto: 'Delete Photo',

    Bio: 'Bio',
    SendMessage: 'Send Message',
    BlockUser: 'Block User',

    NumberOccupied: 'Number occupied',
    NumberIsAlreadyConnectedToATelegramAccount: 'This number {0} is already connected to a Telegram account. Please delete that account before migrating to the new phone number.',

    // Contacts
    Info: 'Info',
    SearchContacts: 'Search for contacts...',
    SearchFriends: 'Search friends...',
    InviteFriends: 'Invite Friends',
    Contacts: 'Contacts',
    Friends: 'Friends',
    NewContact: 'New Contact',
    FirstName: 'First name',
    MiddleName: 'Middle name',
    LastName: 'Last name',
    AddContact: 'Add Contact',

    Online: 'online',
    Recently: 'was recently',
    LastWeek: 'was last week',
    LastMonth: 'was last month',
    ForALongTime: 'was for a long time',
    Was: 'was',

    FailedToAddNewContact: 'Failed to add new contact.',
    ContactsPermissionHasNotBeenGranted: 'Contacts permission has not been granted.',
    AddingContactIsNotATelegramUser: 'This person is not registered on Telegram yet.\n\nYou will be able to send them a Telegram message as soon as they sign up.',
    RequestingContactsPermission: 'Requesting Contacts Permission',
    WeUseContactsToAllowYouToInviteFriends: 'We use contacts to allow you to invite friends',
    ContactsAccessDenied: 'Contacts Access Denied',
    ContactsGrantAccess: 'You can allow access to your contacts in settings',
    OpenSettings: 'Open Settings',
    Recent: 'Recent',

    // Messenger
    Today: 'Today',
    Yesterday: 'Yesterday',
    NewMessage: 'New Message',
    NewGroup: 'New Group',
    CreateChannel: 'Create Channel',
    DiscoverBots: 'Discover Bots',
    Members: 'Members',
    WhomWouldYouLikeToMessage: 'Who do you want to message?',
    AddMembers: 'Add Members',
    AddSubscribers: 'Add Subscribers',
    AddAdministrator: 'Add Administrator',
    GroupName: 'Group Name',
    Group: 'Group',
    You: 'You',
    Member01: 'member', // 01 member
    Member11: 'members', // 21 members
    Member24: 'members', // 22,23,24 members
    Member50: 'members', // 25,26,27,28,29,30 members
    NewRecord: 'New',
    NewChannel: 'New',
    ChannelName: 'Channel Name',
    YouCanProvideAnOptionalDescriptionForYourChannel: 'You can provide an optional description for your channel.',
    Channel: 'Channel',
    Public: 'Public',
    Private: 'Private',
    PrivateChannelsCanOnlyBeJoinedViaAnInviteLink: 'Private channels can only be joined via an invite link.',
    PeopleCanJoinYourChannelByFollowingThisLink: 'People can join your channel by following this link. You can revoke the link at any time.',
    PublicChannelsCanBeFoundInSearchAnyoneCanJoinThem: 'Public channels can be found in search. Anyone can join them.',
    PeopleCanShareThisLinkWithOtherAndFindYourChannel: 'People can share this link with others and find your channel using search.',
    WhomWouldYouLikeToAdd: 'Who would you like to add?',
    UnreadMessages: 'Unread messages',
    SayHello: 'Say "Hello"',

    // WalletExporter
    BackupWalletSuggestion: 'Please backup your account! In order to do so we will present you with 12 words. Please write them down and keep them safe! They will be used to restore your account or open it on another device.',
    BackupWalletTitle: 'Please write down the following 12 words.',
    BackupWalletDescription: 'In order to access your TON Wallet secure application on another device you will have to use a 12 word seed phrase. TON Wallet has NO WAY to restore your password or the 12 word phrase. You should never lose it! This phrase should NEVER be revealed to anybody but you! It allows access to your account, to change local passwords, to create and sign Offers. If you lose your 12 word phrase you will NEVER be able to access your account!',
    Word: 'Word',
    OutOf: 'out of',
    BackupNow: 'Backup now',
    Later: 'Later',

    // WalletSetup
    WalletSetup: {
        LogoText: 'Fast way to receive and send cryptocurrencies',
        CreateANew: 'Create a new Wallet',
        Restore: 'Restore Wallet',
        PrivateKey: 'Private Key',
        PrivateKeyDetails: 'It is the only thing that can provide access to your data and money and recover the wallet if needed.',
        PrivateKeyHint: 'We recommend not saving this key but to use a 12 word mnemonic phrase associated with it. It’s much easier to remember a phrase than a long number.',
        KeyPhrase: 'Key Phrase',
        KeyPhrasePlaceholder: 'Password',
        KeyPhraseDetails: 'Write down all these words on paper and keep them in a safe place. You will need them if you lose or reinstall the wallet.',
        KeyPhraseWarning: 'Attention! Without this phrase you won\'t be able to restore access to your Wallet!',
        KeyPhraseHint: 'Do not take pictures or screenshots. Other programs can get access to them.',
        PhraseCheck: 'Phrase Check',
        PhraseCheckDetails: 'We do not save your phrase and only you are responsible for the safety of your data. To make sure you remember the phrase, please enter it in the field below.',
        PhraseCheckHint: '12 words.',
        PhraseCheckSuccess: 'Success.',
        PhraseCheckAgreement: 'I understand that if I lose the key phrase, no one would be able to recover this wallet.',
        RestoreWallet: 'Restore Wallet',
        RestoreWalletDetails: 'Sign in with the key phrase you were given when you created your wallet.',
        EncodePhrase: 'Encode Phrase',
        IHaveWrittenAndRemembered: 'I\'ve written it down',
        OKContinue: 'Let\'s  go',
        Seconds: 's',
        SetLocalPassword: 'Create Login Method',
        SetLocalPasswordDetails: 'Set a passcode to enter the wallet and confirm your transactions. It will only work on this device.',
        SetLocalPasswordPlaceholder: 'New Passcode',
        SetLocalPasswordHint: 'Minimum 8 characters.',
        SetLocalPasswordWarning: 'Attention! To access the wallet on another device you will need your Key Phrase.',
        SetLocalPasswordContinue: 'Continue',
        ConfirmLocalPassword: 'Confirm Login Method',
        ConfirmLocalPasswordDetails: 'Set a Passcode to enter the wallet and confirm your transactions. It will only work on this device.',
        ConfirmLocalPasswordPlaceholder: 'Repeat Passcode',
        ConfirmLocalPasswordHint: '',
        ConfirmLocalPasswordSuccess: 'Success.',
        ConfirmLocalPasswordWarning: 'Attention! To access the wallet on another device, you will need your Key Phrase.',
        ConfirmLocalPasswordContinue: 'OK, let’s go',
    },

    // WalletImporter
    AddWallet: 'TON Wallet account uses TON blockchain to send and receive GRAM transactions.\nPlease create or restore your TON Wallet account here.',
    SeedPhrase: '12 word key phrase',
    ContinueWithPassword: 'Continue with password',
    CreateNewAccount: 'Create new account',
    RestoreFrom12Words: 'Restore from 12 word key phrase',

    // WalletTransferer
    ScanQRCodeWithTONChatApplicationToContinue: 'Please use TON Wallet app to scan this QR code.\nPress Scan button is located in the upper right-hand corner of the Main screen.',
    WalletQRCodeScannerHint: 'Please scan QR code from the TON Wallet web application in order to sync your account',

    // Chat list
    YouHaveNoConversationsYet: 'You have no conversations yet',

    // Chat
    ChatWith: 'Chat with',
    DoYouWantToBlockThisUser: 'Do you want to block this user?',
    TypeMessage: 'Write a message...',
    FailedToLoadDocument: 'Failed to load document.',

    // Wallet
    WeNeedYourPassword: 'We need your local password to perform operations on this device',
    WeNeedYourPasswordToUpgradeWallet: 'We need your local password to upgrade your wallet',
    Password: 'Password',
    MasterPassword: 'Master Password',
    ConfirmPassword: 'Confirm Password',
    WrongPassword: 'Wrong password',
    UpgradingWallet: 'Upgrading your wallet...',
    ExportingBackupPhrase: 'Exporting backup phrase...',
    DecryptingDocument: 'Decrypting document...',
    RecoveringDocument: 'Please wait. We are recovering the document. It may take a while...',
    SorryYouDoNotHaveAnAccessToThisDocument: 'Sorry you don\'t seem to have access to this document. You can always import another wallet with its 12-word seed phrase.',
    moreWords01: 'more word',
    moreWords11: 'more words',
    moreWords24: 'more words',
    moreWords50: 'more words',

    // Username
    Username_InvalidTooShort: 'A username must have at least 5 characters.',
    Username_InvalidStartsWithNumber: 'Sorry, a username can\'t start with a number.',
    Username_InvalidCharacters: 'Sorry, this username is invalid.',
    Username_InvalidTaken: 'Sorry, this username is already taken.',
    Username_CheckingUsername: 'Checking username...',
    Username_UsernameIsAvailable: '{0} is available.',

    // 2FA
    TwoStepAuth_EnterPasswordHelp: 'You have enabled Two-Step Verification, so your account is protected with an additional password.',
    TwoStepAuth_EnterPasswordInvalid: 'Invalid password. Please try again.',
    TwoStepAuth_RecoveryUnavailable: 'Since you didn\'t provide a recovery e-mail when setting up your password, your remaining options are either to remember your password or to reset your account.',
    TwoStepAuth_RecoveryFailed: 'Your remaining options are either to remember your password or to reset your account.',
    TwoStepAuth_RecoveryCodeHelp: 'Please check your e-mail and enter the 6-digit code we\'ve sent you to deactivate your cloud password.',
    TwoStepAuth_RecoveryEmailUnavailable: 'Having trouble accessing your e-mail {0}?',
    TwoStepAuth_RecoveryCodeExpired: 'We have sent you a new 6-digit code.',
    TwoStepAuth_InvalidPasswordError: 'Invalid password. Please try again.',
    TwoStepAuth_FloodError: 'Limit exceeded. Please try again later.',

    // Messenger
    Messenger: 'Messenger',
    SearchForMessagesOrUsers: 'Search for messages or users',
    PleaseSelectAChatToStartMessaging: 'Please select a chat to start messaging',

    // Groups && Channels
    DoYouWantToLeaveChannel: 'Do you want to leave the channel?',
    DoYouWantToLeaveGroup: 'Do you want to leave the group? You will not be able to join this group again.',
    DoYouWantToClearHistory: 'Do you want to clear chat history?',
    DoYouWantToDeleteChannel: 'Wait! Deleting this channel will remove all members and all messages will be lost. Delete the channel anyway?',
    DoYouWantToDeleteGroup: 'Wait! Deleting this group will remove all members and all messages will be lost. Delete the group anyway?',
    LeaveChannel: 'Leave Channel',
    LeaveGroup: 'Leave Group',
    DeleteChannel: 'Delete channel',
    DeleteGroup: 'Delete group',
    ClearHistory: 'Clear History',
    Admins: 'Admins',
    ChannelInfo: 'Channel Info',
    Administrators: 'Administrators',
    Administrator: 'Administrator',
    Subscribers: 'Subscribers',
    Blacklist: 'Blacklist',
    FailedToLeaveChannel: 'Failed to leave channel',
    FailedToLeaveGroup: 'Failed to leave group',
    RevokeLink: 'Revoke link',
    ConvertToSupergroup: 'Convert To Supergroup',
    ConvertToSupergroupDetails: 'In supergroups:\n• New members can see the full message history\n• Deleted messages will disappear for all members\n• Admins can pin important messages\n• The creator can set a public link for the group',
    AllMembersAreAdmins: 'All members are admins',
    OnlyAdminsCanAddAndRemoveMembers: 'Only admins can add and remove members and edit the group name and photo.',
    AllMembersCanAddAndRemoveMembers: 'All members can add and remove members and edit the group name and photo.',
    YouCanAddAdministratorsToHelpYouManageYourChannel: 'You can add administrators to help you manage your channel. Tap and hold to remove admins.',
    Creator: 'Creator',
    AddedBy: 'Added by {0}',
    GroupPhotoUpdated: 'updated the group photo.',

    // Wallet
    Wallet: 'Wallet',
    PublicAddress: 'Public Address',
    SearchForTransactions: 'Search for transactions...',
    YouHaveNoTransactionsYet: 'You have no transactions yet',
    Recipient: 'Recipient',
    Recipients: 'Recipients',
    SearchForRecipients: 'Search for recipients...',
    TotalBalance: 'Total Balance',
    Transaction: 'Transaction',
    Sender: 'Sender',
    FailedToCreateWallet: 'Failed to create wallet',
    FailedToCreateNewAccount: 'Failed to create new account',
    FailedToSendTransaction: 'Failed to send transaction',
    FailedToSetLimit: 'Failed to set limit',
    BackupWallet: 'Backup wallet',
    Amount: 'Amount',
    Date: 'Date',
    Balance: 'Balance',
    Gram: 'GRAM',
    gram: 'Gram',
    Send: 'Send',
    UserHasNoWallet: 'This user does not have a wallet yet, but we will send a link to create one in order to receive this transaction.',
    TransactionFrom: 'You have received a transaction from',
    InvitesYouToWallet: 'Invites you to join TONWallet and receive a transaction.',
    Transactions: 'Transactions',

    // Accounts
    Account: 'Account',
    Accounts: 'Accounts',
    MyMainAccount: 'My Main Account',
    MyAccount: 'My Account',
    Limits: 'Limits',
    SingleOperationLimit: 'Single Operation up to',
    PublicAccount: 'Public account',
    AccountTypeHint: 'Setting your account address to public will make it visible in your profile.',
    PublicAccountWarning: 'Attention! If you provide your public address to third parties it will be visible to them even after you make it private.',
    MakePublic: 'Make public',
    NoThankYou: 'No thank you',
    AddNewLimit: 'Add new',
    NewLimit: 'New limit',
    EditLimit: 'Edit limit',
    NewAccount: 'New account',
    Period: 'Period',
    UplimitRule: 'Uplimit Rule',
    DoYouWantToDeleteLimit: 'Do you want to delete the limit?',
    AccountLimitPeriod: {
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        total: 'Total',
    },
    AccountLimitRule: {
        passportVerification: 'Passport Verification',
        twoFactorAuthentication: '2-Factor Authorization',
    },
    AccountAddress: 'Address',
    AddressURLHint: 'On this webpage your friends can replenish your wallet.',
    AddressShare: 'Share',
    Request: 'Request',

    // Passport
    ViewPassport: 'View Passport',
    PassportNeedsAttention: [
        'Please add all your personal information to your passport',
        'Please add all your personal information and an official document to your passport',
        'Passport validation is required',
    ],
    AtTime: 'at',
    Passport: 'Passport',
    Status: 'Status',
    ReviewAndConfirm: 'Review and Confirm',
    PassportRequestReview: 'Your documents are being verified now. We will get back to you within 2 business hours',
    PassportFetchingStatus: 'Fetching status...',
    PassportStatus: [
        'None',
        'Bad',
        'Suspicious',
        'Unknown',
        'Pending',
        'Trusted',
    ],
    PassportSaveSuccess: 'Your passport has been updated',
    PassportSaveError: 'An error has occurred while updating your passport',
    DeleteDocument: 'Delete Document',
    DeleteDocumentMessage: 'Do you want to delete this document from your passport?',
    DocumentDeleteDataAndFiles: 'Delete data and files',
    Information: 'Information',
    Confirmed: 'Confirmed',
    Unconfirmed: 'Unconfirmed',
    PersonalDetails: 'Personal Details',
    IdentityDocument: 'Identity Document',
    FillInInformation: 'Fill in the required information below',
    FillInPersonalDetails: 'Fill in your personal details',
    UploadAScan: 'Upload a scan of your passport or other ID',
    DoB: 'Date of birth',
    DoBMin: 'Must be older than',
    DoBMax: 'Must be younger than',
    Gender: 'Gender',
    Citizenship: 'Citizenship',
    Residence: 'Country of residence',
    SelectResidence: 'Select your country of residence…',
    SelectCountry: 'Select country…',
    Country: 'Country',
    Address: 'Address',
    Apartment: 'Apt / Ste / Unit',
    City: 'City',
    State: 'State',
    PostalCode: 'Postal code',
    Male: 'Male',
    Female: 'Female',
    RequestedFiles: 'Requested Files',
    IdentificationDocument: 'Identification Document',
    IdentityCard: 'Identity Card',
    DriversLicense: 'Driver\'s License',
    InternalPassport: 'Internal Passport',
    ResidencePermit: 'Residence Permit',
    AddPassport: 'Add Passport',
    AddIdentityCard: 'Add Identity Card',
    AddDriversLicense: 'Add Driver\'s License',
    AddResidencePermit: 'Add Residence Permit',
    AddInternalPassport: 'Add Internal Passport',
    EditPassport: 'Edit Passport',
    EditIdentityCard: 'Edit Identity Card',
    EditDriversLicense: 'Edit Driver\'s License',
    EditInternalPassport: 'Edit Internal Passport',
    EditResidencePermit: 'Edit Residence Permit',
    DocumentNumber: 'Document Number',
    DocumentExpiration: 'Expiry Date',
    DocumentFront: 'Front Side',
    DocumentReverse: 'Reverse Side',
    DocumentSelfie: 'Selfie with Document',
    DocumentFrontDescription: 'Upload a photo of the front side of your document',
    DocumentReverseDescription: 'Upload a photo of the reverse side of your document',
    DocumentSelfieDescription: 'Upload a selfie holding your document',
    SelfieWithPassportOrID: 'Selfie with passport or ID',
    DocumentRequirements: 'The document must contain your photograph, first and last name, date of birth, document number, country of issue and expiration date.',

    PublicAddressCopiedToClipboard: 'Public address copied to clipboard.',
    Tokens: 'Tokens',
    Currencies: 'Currencies',
    Events: 'Events',
    Pay: 'Pay',

    // Transactions
    Exchange: 'Exchange',
    ChooseDepositToken: 'Choose Deposit Token',
    ExchangeFrom: 'From',
    ExchangeTo: 'To',
    WriteOffAccount: 'Write-off Account',
    SearchByToken: 'Search by Token...',
    SearchByAccount: 'Search by Account...',
    Deposit: 'Deposit',
    max: 'max.',
    Receive: 'Receive',
    ConfirmAndTransfer: 'Confirm & Transfer',
    YourTransactionCouldNotBeCompleted: 'Your transaction could not be completed',
    YourTransactionCompleted: 'Your transaction has been completed',
    ViewOnEtherscan: 'View on Etherscan',
    TransactionStatus: {
        rejected: 'Rejected at {0}',
        aborted: 'Aborted at {0}',
        sending: 'Pending...',
    },
    fee: 'Fees',
    feeAmount: '≈ {0}',
    operationTime: 'Operation time',
    immediately: 'Immediately',

    message: {
        sending: 'Pending...',
    },

    ConfirmIdentity: 'To proceed, we need to confirm your identity by sending an SMS text with a code to your phone number',
    SMSNotice: 'Texting fees may apply',

    // Limits
    TransactionError: [
        '-',
        'The transfer limit has been reached',
        'Access denied',
        'Unknown error',
    ],
    LimitSetSuccess: 'The limit has been set successfully.',
    LimitRemoveSuccess: 'The limit has been deleted',

    Gram01: 'Gram', // 01 gram
    Gram11: 'Grams', // 21 grams
    Gram24: 'Grams', // 22,23,24 grams
    Gram50: 'Grams', // 25,26,27,28,29,30 grams

    // Dates
    DateSymbols: { year: 'YYYY', month: 'MM', day: 'DD' },

    // Stub page
    GetNotifiedWhenWeLaunch: 'Get notified when we launch',
    WillGetInTouchWithYouSoon: 'Will get in touch with you soon.',
    ThanksForCooperation: 'Thanks for your cooperation.',
    Contact: 'For more information, contact',
    PressEmail: 'press@tonlabs.io',

    // Toasts
    EnterCorrectDataToField: 'Enter correct data into field',

    // Labels
    Phone: 'Phone',
    EmailAddress: 'Email',

    // Feedback module
    ThanksForYourFeedback: 'Thanks for your feedback',
    DescribeYourIssueOrIdea: 'Describe your issue or idea',
    YourEmail: 'Your email',
    SendFeedback: 'Send feedback',
    PushFeedbackShort: 'Give feedback to contribute to the story',
    PushFeedbackLong: 'Give your feedback to help us make the story better. Click here to share.',

    // Seed Phrase Input:
    seedPhraseTypo: 'Seems we have a typo here. Try again',
    greatMemory: 'Great memory!',

    // Cross-services
    WeCanTFindThePageYouReLookingFor: 'We can\'t find the page you\'re looking for.',
    TheRequestedServiceIsDownToGetUpAsapTryAgainLater: 'The requested service is down. Will be up ASAP. Please try again later.',
    WelcomeTo000: 'Welcome to 000',
    BackToHome: 'Back to Home',
    serviceUnavailable: 'Service unavailable',

    // Common
    // Time
    hours: 'hours',
    minutes: 'minutes',
    hours01: 'hour',
    hours11: 'hours',
    hours24: 'hours',
    hours50: 'hours',
    minutes01: 'minute',
    minutes11: 'minutes',
    minutes24: 'minutes',
    minutes50: 'minutes',
};

export default en;
