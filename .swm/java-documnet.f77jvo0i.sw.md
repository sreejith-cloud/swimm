---
title: Java documnet
---
# Introduction

This document will walk you through the implementation of the <SwmToken path="/TFolioPublicService.java" pos="57:4:4" line-data="public class TFolioPublicService implements IConstant {">`TFolioPublicService`</SwmToken> feature.

The feature handles user login and two-factor authentication (TFA) for the TFolio application.

We will cover:

1. Why the login endpoint was implemented.
2. How the TFA validation is handled.
3. The error handling mechanism.

# Code review

## Class definition and context setup

<SwmSnippet path="/TFolioPublicService.java" line="51">

---

The class <SwmToken path="/TFolioPublicService.java" pos="57:4:4" line-data="public class TFolioPublicService implements IConstant {">`TFolioPublicService`</SwmToken> is defined with the necessary context and logger setup. This is crucial for handling HTTP requests and logging information.

```

/**
 *
 * @author tra853
 */
@Path("/public")
public class TFolioPublicService implements IConstant {
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="58">

---

We initialize the logger and read allowed request IDs from properties.

```

    private static final Logger LOGGER = LogManager.getLogger("TFolioPublicService");

    private static String[] allowedReqIds = PropertyReader.ReadPropValue(IConstant.PROP_KEY_SERVICE_PUBLIC_REQIDS).split("\\|");

    @Context
    private HttpServletRequest httRequest;
```

---

</SwmSnippet>

## Login endpoint

<SwmSnippet path="/TFolioPublicService.java" line="65">

---

The <SwmToken path="/TFolioPublicService.java" pos="76:5:5" line-data="    public String login(String request) throws JSONException {">`login`</SwmToken> method handles user login requests. It parses the request, logs the IP address, and processes the login based on the provided details.

```

    @Context
    private HttpServletResponse httpresponse;

    @Context
    private ServletContext context;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/tfolioLogin")
    public String login(String request) throws JSONException {
        JSONObject obj = new JSONObject(request);
        JSONObject response = new JSONObject();
        JSONObject detailObj = new JSONObject();
        StringBuffer apiResponse = new StringBuffer();
        String sessionKey = "";
        String uCode = "";
        String appName = "";
        boolean valUser = false;
        String rmtAddr = "";
        String validUser = "";
        int companyId = 0;
        String Authcode = "";
//        String secretKey = "";
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="90">

---

The method logs the request details and checks for the remote IP address.

```

        LOGGER.info("==================================================");
//        if (obj.has("CompanyId")) {
//            companyId = obj.getInt("CompanyId");
//        }
    Date date = new Date();  
    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");  
//    SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");  
    String strDate= formatter.format(date);  
        if (obj.has("remoteIp")) {
            rmtAddr = obj.getString("remoteIp");
        } else {
            rmtAddr = getRemotAddress(httRequest);
        }
        LOGGER.info("Login request IP Address :: " + rmtAddr.toString());
        LOGGER.info("==================================================");
    LOGGER.info("Date : "+strDate); 
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="143">

---

It processes the login request based on the provided user code and session key.

```

                if (request != null && !request.equalsIgnoreCase("")) {
                    detailObj = new JSONObject(request);
                    if (detailObj != null && detailObj.has("UserCode")) {
                        LOGGER.info("==================================================");
                        LOGGER.info("Login request User Code :: " + detailObj.getString("UserCode").toString());
                        LOGGER.info("==================================================");
//                    if (detailObj.has("LogUserType")) {
//                        appName = detailObj.getString("LogUserType");
//                        LOGGER.info("Login request User Type :: " + detailObj.getString("LogUserType").toString());
//                    } else {
//                        appName = "";
//                    }
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="156">

---

If the session key and user code are valid, it validates the user and performs an external login.

```

                        if (detailObj.has("SessionKey")) {
                            sessionKey = detailObj.getString("SessionKey");
                            LOGGER.info("Login request Session Key :: " + detailObj.getString("SessionKey").toString());
                            uCode = detailObj.getString("UserCode");
                            if (sessionKey != null && !sessionKey.equalsIgnoreCase("") && uCode != null && !uCode.equalsIgnoreCase("")) {

                                if (appName.equalsIgnoreCase("SELFIE")) {
                                    validUser = detailObj.getString("EUSER");
                                    valUser = true;
                                } else if (appName != null && appName.equalsIgnoreCase("BOCC")) //                                    ||appName.equalsIgnoreCase("SELFIE")||appName.equalsIgnoreCase("GCC") 
                                {
                                    validUser = chkExternalDbLogin(uCode, sessionKey, appName);
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="169">

---

If the user is valid, it calls the <SwmToken path="/TFolioPublicService.java" pos="179:5:5" line-data="                                    response = extLogin(uCode, appName, rmtAddr, validUser, companyId, Authcode);">`extLogin`</SwmToken> method to handle the external login process.

```

                                    LOGGER.info(" VALID USER STATUS " + validUser.toString());
                                    if (validUser != null && !validUser.equalsIgnoreCase("")) {
                                        valUser = true;
                                    }
                                } else {
                                    valUser = chkExternalUrlValid(uCode, sessionKey);
                                }
                                if (valUser) {
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="178">

---

If the external login fails, it returns an error response.

```

                                    response = extLogin(uCode, appName, rmtAddr, validUser, companyId, Authcode);
                                } else {
                                    response = getErrorResponse(4, "Failed to login the external service");
                                    LOGGER.error("Failed to login the external service");
                                }
                            } else {
                                response = getErrorResponse(2, "Invalid external login request");
                                LOGGER.error("Invalid external login request");
                            }
                        } else if (detailObj.has("Password")) {
                            
                            response = dbLogin(detailObj, apiResponse, rmtAddr, validUser);
                            
                       String tfaSttings = PropertyReader.ReadPropValue("tfasettings");     
                       String aesKey = PropertyReader.ReadPropValue("aes.enc.key");     
                       String aesIv = PropertyReader.ReadPropValue("aes.enc.iv");     
                            String encrString =AESEncryption.encrypt(detailObj.getString("UserCode")+"||"+strDate, aesKey, aesIv);
//                            String encrString =AESEncryption.encrypt(detailObj.getString("UserCode")+"||"+strDate, "geojit#123$gfsl@", "1234560987654321");
                            response.put("encrString", encrString);
//                            response.put("tfaSettings", "otp|totp|dob");
                            response.put("tfaSettings", "1|1|0");
//                            USERCODE||TODAYSDATE
```

---

</SwmSnippet>

## TFA validation endpoint

<SwmSnippet path="/TFolioPublicService.java" line="225">

---

The <SwmToken path="/TFolioPublicService.java" pos="232:5:5" line-data="    public String validateTfa(String request) throws JSONException {">`validateTfa`</SwmToken> method handles TFA validation requests. It parses the request, logs the IP address, and processes the TFA based on the provided authentication type.

```

    }
    
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
        @Path("/validatetfa")
    public String validateTfa(String request) throws JSONException {
        JSONObject obj = new JSONObject(request);
        JSONObject response = new JSONObject();
        JSONObject detailObj = new JSONObject();
        StringBuffer apiResponse = new StringBuffer();
        String sessionKey = "";
        String uCode = "";
        String appName = "";
        boolean valUser = false;
        String rmtAddr = "";
        String validUser = "";
        int companyId = 0;
        String Authcode = "";
        String Authtype = "";
        String secretKey = "";
//        HttpSession session = httRequest.getSession(false);
        HttpSession session = SessionUtil.getReqSession(httRequest);
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="249">

---

The method logs the request details and checks for the remote IP address.

```

        LOGGER.info("==================================================");
//        if (obj.has("CompanyId")) {
//            companyId = obj.getInt("CompanyId");
//        }
        if (obj.has("remoteIp")) {
            rmtAddr = obj.getString("remoteIp");
        } else {
            rmtAddr = getRemotAddress(httRequest);
        }
        LOGGER.info("Login request IP Address :: " + rmtAddr.toString());
        LOGGER.info("==================================================");
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="261">

---

It processes the TFA request based on the provided authentication code and type.

```

        if (obj.has("Authcode")) {
            Authcode = obj.getString("Authcode");
        }
        if (obj.has("Authtype")) {
            Authtype = obj.getString("Authtype");
        }
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="268">

---

If the authentication type is OTP, it verifies the OTP.

```

        try {
            LOGGER.info("Authtype ==>  " + Authtype);
//            LOGGER.info("session Id  " + session.getId());

            if (session != null) {
                LOGGER.info("------------------- valid session");
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="275">

---

If the authentication type is TOTP, it verifies the TOTP.

```

                if (Authtype.equalsIgnoreCase("otp")) {
                    LOGGER.info("Authtype : " + Authtype);
                    Sendotp otp = new Sendotp();
                    JSONObject req = new JSONObject();
                    req.put("userkeyinfo", obj.getString("UserCode"));
                    req.put("OTP", Authcode);
                    JSONObject verifyOtp = new JSONObject(otp.VerifyOtpservice(req.toString()));
                    LOGGER.info("verify otp response : " + verifyOtp);
                    
                    if (verifyOtp.getInt("errorCode") != 0) {
                        return verifyOtp.toString();
                    }else{
                        response=verifyOtp;
                    }
                }
                if (Authtype.equalsIgnoreCase("totp")) {
                    LOGGER.info("Authtype : " + Authtype);
```

---

</SwmSnippet>

## Helper methods

<SwmSnippet path="/TFolioPublicService.java" line="464">

---

The <SwmToken path="/TFolioPublicService.java" pos="102:5:5" line-data="            rmtAddr = getRemotAddress(httRequest);">`getRemotAddress`</SwmToken> method retrieves the remote IP address from the request.

```

    public String getRemotAddress(HttpServletRequest request) {
        String remoteAddress = null;
        if ((remoteAddress = request.getHeader("x-forwarded-for")) != null) {
            remoteAddress = request.getHeader("x-forwarded-for");
        }
        if (remoteAddress == null) {
            remoteAddress = request.getRemoteHost();
        }
        if (remoteAddress == null) {
            remoteAddress = request.getRemoteAddr();
        }
        if (remoteAddress == null) {
            remoteAddress = "{local}";
        }
        return remoteAddress;
    }
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="481">

---

The <SwmToken path="/TFolioPublicService.java" pos="168:5:5" line-data="                                    validUser = chkExternalDbLogin(uCode, sessionKey, appName);">`chkExternalDbLogin`</SwmToken> method checks the external database for user validation.

```

    public String chkExternalDbLogin(String clientCode, String sessKey, String LogUserType) {
        String validUser = "";
        JSONObject response = new JSONObject();
        HTTPServiceRequest httpreq = null;
        JSONObject job = new JSONObject();
        try {
            if (clientCode != null && sessKey != null) {
                JSONArray jarray = new JSONArray();
                JSONObject parm = new JSONObject();
                parm.put("ClientCode", clientCode);
                parm.put("SessionKey", sessKey);
                parm.put("LogUserType", LogUserType);
                jarray.put(parm);
                job.put(BATCHSTATUS, FALSE);
                job.put(DETAILARRAY, jarray);
                job.put(STOREDPROCID, 5098);
                job.put(OUTTBLCOUNT, STRING_ZERO);
//                httpreq = new HTTPServiceRequest();
//                JSONObject resp = httpreq.dbServiceCall(job.toString(), "/generaldbservice/ExecuteSPformated");
                DBReqProcessor db = new DBReqProcessor();
                JSONObject resp = db.executeSPFormated(RESULTSET);
                LOGGER.info("External Login check DB Resp : " + resp);
                response = resp;
                if (response != null) {
                    LOGGER.info("External Login check DB Resp : " + resp.has("errorCode"));
                    LOGGER.info("External Login check DB Resp : " + resp.getInt("errorCode"));
                    if (response.has("errorCode") && response.getInt("errorCode") == 0) {
                        if (response.has(SP_RESULTS)) {
                            JSONArray results = response.getJSONArray(SP_RESULTS);
                            if (results != null && results.length() > 0) {
                                JSONObject rst = (JSONObject) results.get(0);
                                if (rst != null && rst.has(ROWS)) {
                                    JSONArray rowresult = rst.getJSONArray(ROWS);
                                    if (rowresult != null && rowresult.length() > 0) {
                                        JSONArray row = (JSONArray) rowresult.get(0);
                                        if (row != null && row.length() > 0) {
                                            String errMsg = (String) row.get(0);
                                            String errCode = (String) row.get(1);
                                            String Euser = (String) row.get(2);
                                            LOGGER.info("EUSER INSIDE DB:" + Euser);
                                            if (Integer.parseInt(errCode) == 0) {
                                                LOGGER.info("External Login check DB Level Success.=============");
                                                validUser = Euser;
                                            } else {
                                                response = getErrorResponse(1, "User authentication failed");
                                                LOGGER.warn("External Login check DB level authentication failed with db error code and msg are " + errCode + " " + errMsg);
                                            }
                                        } else {
                                            response = getErrorResponse(1, "User authentication failed");
                                            LOGGER.warn("External Login check DB level authentication failed with no result rows.");
                                        }
                                    } else {
                                        response = getErrorResponse(1, "User authentication failed");
                                        LOGGER.warn("External Login check DB level authentication failed with no result rows.");
                                    }
                                } else {
                                    response = getErrorResponse(1, "User authentication failed");
                                    LOGGER.warn("External Login check DB level authentication failed with no result row object.");
                                }
                            } else {
                                response = getErrorResponse(1, "User authentication failed");
                                LOGGER.warn("External Login check DB level authentication failed with no result arrays.");
                            }
                        } else {
                            response = getErrorResponse(1, "User authentication failed");
                            LOGGER.warn("External Login check DB level authentication failed with no result.");
                        }
                    } else {
                        response = getErrorResponse(1, "User authentication failed");
                        LOGGER.warn("External Login check DB level authentication failed with error " + response.get("errorCode"));
                    }
                } else {
                    response = getErrorResponse(1, "User authentication failed");
                    LOGGER.warn("External Login check DB level authentication failed with null response");
                }
            } else {
                response = getErrorResponse(3, "Invalid login request");
                LOGGER.error("External Login check DB level Invalid login request");
            }
        } catch (Exception ex) {
            response = getErrorResponse(1, ex.getMessage());
            ex.printStackTrace();
            LOGGER.error(ex);
        }
        return validUser;
    }
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="568">

---

The <SwmToken path="/TFolioPublicService.java" pos="175:5:5" line-data="                                    valUser = chkExternalUrlValid(uCode, sessionKey);">`chkExternalUrlValid`</SwmToken> method validates the user session using an external URL.

```

    private boolean chkExternalUrlValid(String userCode, String SessionId) {
        boolean validUser = false;
        String validUrl = PropertyReader.ReadPropValue("ExternalValidationLink");
        try {
            JSONObject jsonReqObject = new JSONObject();
            JSONObject jsonIntReqObj = new JSONObject();
            JSONObject jsonObjData = new JSONObject();
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="623">

---

The <SwmToken path="/TFolioPublicService.java" pos="179:5:5" line-data="                                    response = extLogin(uCode, appName, rmtAddr, validUser, companyId, Authcode);">`extLogin`</SwmToken> method handles the external login process and sets the session attributes.

```

    private JSONObject extLogin(String userCode, String appName, String rmtAddr, String EUser, int companyId, String Authcode) {
        LOGGER.info(" ======== USERCODE  " + userCode + "appName :" + appName + " EUser : " + EUser + "rmtAdr " + rmtAddr);
        JSONObject response = new JSONObject();
        HTTPServiceRequest httpreq = null;
        JSONObject job = new JSONObject();
        try {
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="720">

---

The <SwmToken path="/TFolioPublicService.java" pos="181:5:5" line-data="                                    response = getErrorResponse(4, &quot;Failed to login the external service&quot;);">`getErrorResponse`</SwmToken> method constructs an error response JSON object.

```

    private JSONObject getErrorResponse(int errorCode, String errorMsg) {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("errorCode", errorCode);
            jsonObject.put("errorMsg", errorMsg);
        } catch (JSONException e) {
            LOGGER.error(e.getMessage());
        }
        return jsonObject;
    }
```

---

</SwmSnippet>

<SwmSnippet path="/TFolioPublicService.java" line="731" collapsed>

---

The <SwmToken path="/TFolioPublicService.java" pos="190:5:5" line-data="                            response = dbLogin(detailObj, apiResponse, rmtAddr, validUser);">`dbLogin`</SwmToken> method handles the database login process and sets the session attributes.

```

    private JSONObject dbLogin(JSONObject detailObj, StringBuffer apiResponse, String rmtAddr, String Euser) {
        JSONObject response = new JSONObject();
        HTTPServiceRequest httpreq = null;
        JSONObject job = new JSONObject();
        String usrCode = "";
        try {
            LOGGER.info("tryyyyyy");
```

---

</SwmSnippet>

# Conclusion

The <SwmToken path="/TFolioPublicService.java" pos="57:4:4" line-data="public class TFolioPublicService implements IConstant {">`TFolioPublicService`</SwmToken> class provides endpoints for user login and TFA validation. It includes detailed logging and error handling to ensure robust processing of login requests. The helper methods support the main functionality by handling specific tasks like IP retrieval, external database validation, and session management.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBc3dpbW0lM0ElM0FzcmVlaml0aC1jbG91ZA==" repo-name="swimm"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
