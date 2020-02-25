export class ApiList {

    public static AUTH_APIS = {
        token: 'auth/token',
        signIn: 'auth/signin',
        loginChecker: 'auth/secret',
        resetPassword: 'auth/password/reset',
        forgotPassword: 'auth/password/forgot',
        signUp: 'auth/signup',
        captcha: 'auth/captcha',
        otpVerification: 'auth/otp/check',
        resendOtpVerification: 'auth/otp/send',
        signOut: 'auth/signout'
    };

    public static PET_APIS = {
        petList: 'pet/list',
        pet: 'pet',
        pictureUpload: 'storage/upload',
    };

    public static PAYMENT_API = {
        session: 'checkout',
        sessionData: 'checkout/session',
        success: 'checkout/success'
    };
    public static TEMPLATE_APIS = {
        template: 'template',
    };
    public static SPECIES_APIS = {
        species: 'species'
    };
    public static APPOINTMENT_APIS = {
        appointment: 'appointment',
        allAppointment: 'all/appointment',
        getAllAppointmentByUser: 'appointment/user',
        details: 'appointment/details',
        status: 'appointment/status'
    };
    public static PRACTICEADMIN_APIS = {
        practice: 'practice'
    };
    public static USERS_APIS = {
        user: 'user',
    };

    public static SCHEDULING_APIS = {
        slots: 'slots'
    };
    public static PRACTICES_APIS = {
        practice: 'practice'
    };

    public static ONLINE_CONSULTATION_API = {
        start: 'video/session/start',
        end: 'video/session/stop'
    };

    public static MAGICLINK_APIS = {
        mls: 'mls'
    };

    public static APPOINTMENT_TYPE_API = {
        types: 'appointment/type'
    };
}
