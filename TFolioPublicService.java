/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gtl.tfolio.service;

import com.gtl.ws.constants.IConstant;
import static com.gtl.ws.constants.IConstant.BATCHSTATUS;
import static com.gtl.ws.constants.IConstant.DETAILARRAY;
import static com.gtl.ws.constants.IConstant.FALSE;
import static com.gtl.ws.constants.IConstant.OUTTBLCOUNT;
import static com.gtl.ws.constants.IConstant.ROWS;
import static com.gtl.ws.constants.IConstant.SP_RESULTS;
import static com.gtl.ws.constants.IConstant.STOREDPROCID;
import static com.gtl.ws.constants.IConstant.STRING_ZERO;
import com.gtl.ws.db.DBReqProcessor;
import com.gtl.ws.service.HTTPServiceRequest;
import com.gtl.ws.service.Sendotp;
import com.gtl.ws.utils.AESEncryption;
import com.gtl.ws.utils.PropertyReader;
import com.gtl.ws.utils.SFSUtil;
import com.gtl.ws.utils.SessionUtil;
import com.gtl.ws.utils.leadServiceUtil;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import static javax.ws.rs.HttpMethod.POST;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author tra853
 */
@Path("/public")
public class TFolioPublicService implements IConstant {

    private static final Logger LOGGER = LogManager.getLogger("TFolioPublicService");

    private static String[] allowedReqIds = PropertyReader.ReadPropValue(IConstant.PROP_KEY_SERVICE_PUBLIC_REQIDS).split("\\|");

    @Context
    private HttpServletRequest httRequest;

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

//        if (obj.has("Authcode")) {
//            Authcode = obj.getString("Authcode");
//        }
//        if (companyId == 4) {
//            Sendotp otp = new Sendotp();
//            JSONObject req = new JSONObject();
//            req.put("userkeyinfo", obj.getString("UserCode"));
//            req.put("OTP", Authcode);
//            JSONObject verifyOtp = new JSONObject(otp.VerifyOtpservice(req.toString()));
//            LOGGER.info("verify otp response : " + verifyOtp);
//            if (verifyOtp.getInt("errorCode") != 0) {
//                return verifyOtp.toString();
//            }
//        }
//        if (companyId == 5) {
//            SFSUtil util = new SFSUtil();
//
//            JSONObject totpEnableResp = new JSONObject(util.checkTotpEnabled(obj.getString("UserCode")));
//             LOGGER.info("totpEnableResp resp : "+totpEnableResp);
//            if (totpEnableResp.has("errorCode") && totpEnableResp.has("errorMsg")) {
//                return getErrorResponse(totpEnableResp.getInt("errorCode"),  totpEnableResp.getString("errorMsg")).toString();
//            }
//            if (totpEnableResp.has("secretKey") && totpEnableResp.has("totpEnable")) {
//                String totpEnable = totpEnableResp.getString("totpEnable").toUpperCase();
//                if (totpEnable.equalsIgnoreCase("N")) {
//                    return getErrorResponse(6, "TOTP is not Registered").toString();
//                }
//               
//                secretKey = totpEnableResp.getString("secretKey");
//                if (!util.validateTotp(secretKey, Authcode, obj.getLong("time"))) {
//                    return getErrorResponse(1, "TOTP verification failed").toString();
//                }
//            }
//        }
        try {

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

                                    LOGGER.info(" VALID USER STATUS " + validUser.toString());
                                    if (validUser != null && !validUser.equalsIgnoreCase("")) {
                                        valUser = true;
                                    }
                                } else {
                                    valUser = chkExternalUrlValid(uCode, sessionKey);
                                }
                                if (valUser) {

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


                            
                            
                        } else {
                            response = getErrorResponse(3, "Invalid login request");
                            LOGGER.error("Invalid login request");
                        }
                    } else {
                        response = getErrorResponse(3, "Invalid login request");
                        LOGGER.error("Invalid login request");
                    }
                } else {
                    response = getErrorResponse(3, "Invalid login request");
                    LOGGER.error("Invalid login request");
                }
        } catch (JSONException ex) {
            LOGGER.error(ex.getMessage(), ex);
            response = dbLogin(detailObj, apiResponse, rmtAddr, validUser);
        } catch (Exception ex) {
            LOGGER.error(ex.getMessage(), ex);
            response = dbLogin(detailObj, apiResponse, rmtAddr, validUser);
        }
        return response.toString();

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

        if (obj.has("Authcode")) {
            Authcode = obj.getString("Authcode");
        }
        if (obj.has("Authtype")) {
            Authtype = obj.getString("Authtype");
        }

        try {
            LOGGER.info("Authtype ==>  " + Authtype);
//            LOGGER.info("session Id  " + session.getId());

            if (session != null) {
                LOGGER.info("------------------- valid session");

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

                    SFSUtil util = new SFSUtil();
                    JSONObject totpEnableResp = new JSONObject(util.checkTotpEnabled(obj.getString("UserCode")));
                    LOGGER.info("totpEnableResp resp : " + totpEnableResp);
                    if (totpEnableResp.has("errorCode") && totpEnableResp.has("errorMsg")) {
                        return getErrorResponse(totpEnableResp.getInt("errorCode"), totpEnableResp.getString("errorMsg")).toString();
                    }
                    if (totpEnableResp.has("secretKey") && totpEnableResp.has("totpEnable")) {
                        String totpEnable = totpEnableResp.getString("totpEnable").toUpperCase();
                        if (totpEnable.equalsIgnoreCase("N")) {
                            return getErrorResponse(6, "TOTP is not Registered").toString();
                        }
                        secretKey = totpEnableResp.getString("secretKey");
                        if (!util.validateTotp(secretKey, Authcode, obj.getLong("time"))) {
                            return getErrorResponse(1, "TOTP verification failed").toString();
                        }else{
                             return getErrorResponse(0, "Success").toString();
                        }
                    }
                }
//                if (request != null && !request.equalsIgnoreCase("")) {
//                    detailObj = new JSONObject(request);
//                    if (detailObj != null && detailObj.has("UserCode")) {
//                        LOGGER.info("==================================================");
//                        LOGGER.info("Login request User Code :: " + detailObj.getString("UserCode").toString());
//                        LOGGER.info("==================================================");
//                        if (detailObj.has("LogUserType")) {
//                            appName = detailObj.getString("LogUserType");
//                            LOGGER.info("Login request User Type :: " + detailObj.getString("LogUserType").toString());
//                        } else {
//                            appName = "";
//                        }
//
//                        if (detailObj.has("SessionKey")) {
//                            sessionKey = detailObj.getString("SessionKey");
//                            LOGGER.info("Login request Session Key :: " + detailObj.getString("SessionKey").toString());
//                            uCode = detailObj.getString("UserCode");
//                            if (sessionKey != null && !sessionKey.equalsIgnoreCase("") && uCode != null && !uCode.equalsIgnoreCase("")) {
//
//                                if (appName.equalsIgnoreCase("SELFIE")) {
//                                    validUser = detailObj.getString("EUSER");
//                                    valUser = true;
//                                } else if (appName != null && appName.equalsIgnoreCase("BOCC")) //                                    ||appName.equalsIgnoreCase("SELFIE")||appName.equalsIgnoreCase("GCC") 
//                                {
//                                    validUser = chkExternalDbLogin(uCode, sessionKey, appName);
//
//                                    LOGGER.info(" VALID USER STATUS " + validUser.toString());
//                                    if (validUser != null && !validUser.equalsIgnoreCase("")) {
//                                        valUser = true;
//                                    }
//                                } else {
//                                    valUser = chkExternalUrlValid(uCode, sessionKey);
//                                }
//                                if (valUser) {
//
//                                    response = extLogin(uCode, appName, rmtAddr, validUser, companyId, Authcode);
//                                } else {
//                                    response = getErrorResponse(4, "Failed to login the external service");
//                                    LOGGER.error("Failed to login the external service");
//                                }
//                            } else {
//                                response = getErrorResponse(2, "Invalid external login request");
//                                LOGGER.error("Invalid external login request");
//                            }
//                        } else if (detailObj.has("Password")) {
//                            response = dbLogin(detailObj, apiResponse, rmtAddr, validUser);
//                        } else {
//                            response = getErrorResponse(3, "Invalid login request");
//                            LOGGER.error("Invalid login request");
//                        }
//                    } else {
//                        response = getErrorResponse(3, "Invalid login request");
//                        LOGGER.error("Invalid login request");
//                    }
//                } else {
//                    response = getErrorResponse(3, "Invalid login request");
//                    LOGGER.error("Invalid login request");
//                }
            } else {
                response = getErrorResponse(3, "Invalid Session");
                LOGGER.error("Invalid Session");
            }
        } catch (JSONException ex) {
            LOGGER.error(ex.getMessage(), ex);
            response = dbLogin(detailObj, apiResponse, rmtAddr, validUser);
        } catch (Exception ex) {
            LOGGER.error(ex.getMessage(), ex);
            response = dbLogin(detailObj, apiResponse, rmtAddr, validUser);
        }
        return response.toString();

    }

    
//    @POST
//    @Produces(MediaType.APPLICATION_JSON)
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Path("/sendotp")
//    public String sendOTP(String request) {
//        String resp = "";
//        JSONObject reqObj = new JSONObject();
//        HTTPServiceRequest httpreq = null;
//        try {
//            LOGGER.info("sendOTP Request Received = " + request);
//            JSONObject req = new JSONObject(request);
//
//            String mobileNo = "";
//            String userkeyinfo = "";
//            String smsotp = "y";
//            String mailotp = "N";
//            String emailId = "";
//            String otpSerAppId = "";
//            String otpSerMsgTmplt = "";
//            String otpSerExpiry = "";
//            String otpSerOtpLngth = "";
//            String otpSerSubject = "";
//            String otpSerMailMsgTmplt = "";
//
//            if (req.has("MOBILENO") && req.has("USERKEYINFO")
//                    && req.has("OTPLENGTH") && req.has("EXPIRY")
//                    && req.has("SMSOTP") && req.has("APPLICATIONID")
//                    && req.has("MSGTEMPLATE")) {
//                otpSerAppId = req.getString("APPLICATIONID").trim();
//                mobileNo = req.getString("MOBILENO").trim();
//                otpSerMsgTmplt = req.getString("MSGTEMPLATE").trim();
//                userkeyinfo = req.getString("USERKEYINFO").trim();
//                otpSerOtpLngth = req.getString("OTPLENGTH").trim();
//                otpSerExpiry = req.getString("EXPIRY").trim();
//                smsotp = req.getString("SMSOTP").trim();
//
//                if (req.has("MAILOTP")) {
//                    mailotp = req.getString("MAILOTP").trim();
//                    if (mailotp.equalsIgnoreCase("Y")) {
//                        emailId = req.getString("MAILID").trim();
//                        otpSerMailMsgTmplt = req.getString("MAILMSGTEMPLATE").trim();
//                        otpSerSubject = req.getString("SUBJECT").trim();
//                    }
//                }
//
//                reqObj.put("usercode", PropertyReader.ReadPropValue(IConstant.OTP_USER));
//                reqObj.put("password", PropertyReader.ReadPropValue(IConstant.OTP_PASSWORD));
//                reqObj.put("senderid", PropertyReader.ReadPropValue(IConstant.OTP_SENDER_ID));
//                reqObj.put("mobileno", mobileNo);
//                reqObj.put("applicationid", otpSerAppId);
//                reqObj.put("userkeyinfo", userkeyinfo.toUpperCase());
//                reqObj.put("msgtemplate", otpSerMsgTmplt);
//                reqObj.put("expiry", otpSerExpiry);
//                reqObj.put("otplength", otpSerOtpLngth);
//                reqObj.put("smsotp", smsotp);
//                reqObj.put("mailotp", mailotp);
//                reqObj.put("mailid", emailId);
//                reqObj.put("subject", otpSerSubject);
//                reqObj.put("mailmsgtemplate", otpSerMailMsgTmplt);
//
//                httpreq = new HTTPServiceRequest();
//                resp = httpreq.sendotpser(reqObj.toString(), "OPT");
//
//                if (resp.isEmpty()) {
//                    resp = getErrorResponse(1, "Error In Receiving Response.").toString();
//                }
//
//            } else {
//                resp = getErrorResponse(1, "Expected parameters Missing.").toString();
//            }
//
//        } catch (Exception ex) {
//            LOGGER.info("Exception received in Sms send otp service.", ex);
//            resp = getErrorResponse(1, "Exception received in Sms send otp service.").toString();
//        }
//        return resp;
//    }

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

    private boolean chkExternalUrlValid(String userCode, String SessionId) {
        boolean validUser = false;
        String validUrl = PropertyReader.ReadPropValue("ExternalValidationLink");
        try {
            JSONObject jsonReqObject = new JSONObject();
            JSONObject jsonIntReqObj = new JSONObject();
            JSONObject jsonObjData = new JSONObject();

            jsonReqObject.put("proc", "external_service");
            jsonReqObject.put("reqMethod", "oms_session_validation");

            jsonObjData.put("userCode", userCode);
            jsonObjData.put("sessionId", SessionId);
            jsonIntReqObj.put("procParams", jsonObjData);
            jsonReqObject.put("intReqObj", jsonIntReqObj);

            String encodedData = jsonReqObject.toString();
            URL url = new URL(validUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/json;");
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Accept", "application/json");
            OutputStream os = connection.getOutputStream();
            os.write(encodedData.getBytes());
            if (connection.getResponseCode() != 200) {
                LOGGER.info("Failed : HTTP error code :: " + connection.getResponseCode());
//                throw new RuntimeException("Failed : HTTP error code : " + connection.getResponseCode());
            } else {
                BufferedReader br = new BufferedReader(new InputStreamReader((connection.getInputStream())));
                String output, outputS = "";
                System.out.println("Output from Server .... \n");
                while ((output = br.readLine()) != null) {
                    LOGGER.info("response output are : " + output);
                    outputS = outputS + output;
                }
                JSONObject outputObj = new JSONObject(outputS);
                Integer validCode = outputObj.getInt("errorCode");
                if (validCode == 0) {
                    validUser = true;
                } else {
                    LOGGER.info("External login url request validation failed :: " + validCode.toString());
                }
                connection.disconnect();
            }
        } catch (MalformedURLException ex) {
            LOGGER.info(ex.getStackTrace());
        } catch (ProtocolException ex) {
            LOGGER.info(ex.getStackTrace());
        } catch (IOException | JSONException ex) {
            LOGGER.info(ex.getStackTrace());
        }
        return validUser;
    }

    private JSONObject extLogin(String userCode, String appName, String rmtAddr, String EUser, int companyId, String Authcode) {
        LOGGER.info(" ======== USERCODE  " + userCode + "appName :" + appName + " EUser : " + EUser + "rmtAdr " + rmtAddr);
        JSONObject response = new JSONObject();
        HTTPServiceRequest httpreq = null;
        JSONObject job = new JSONObject();
        try {

            JSONArray jarray = new JSONArray();
            JSONObject parm = new JSONObject();
            parm.put("UserCode", userCode);

            if (companyId == 2 || companyId == 3) {
                parm.put("CompanyId", companyId);
                parm.put("Authcode", Authcode);
            } else {
                parm.put("CompanyId", companyId);
            }
            parm.put("Password", "");
            parm.put("LogUserType", appName + "|" + rmtAddr + "|" + EUser);
            parm.put("XMLString", "");

            jarray.put(parm);
            job.put(BATCHSTATUS, FALSE);
            job.put(DETAILARRAY, jarray);
            job.put(STOREDPROCID, 1111);
            job.put(OUTTBLCOUNT, STRING_ZERO);
//            httpreq = new HTTPServiceRequest();
//            JSONObject resp = httpreq.dbServiceCall(job.toString(), "/generaldbservice/ExecuteSPformated");
            DBReqProcessor db = new DBReqProcessor();
            JSONObject resp = db.executeSPFormated(RESULTSET);
            LOGGER.info("External Login DB Resp : " + resp);
            response = resp;
            if (response != null) {
                LOGGER.info("External Login Resp : " + resp.has("errorCode"));
                LOGGER.info("External Login Resp : " + resp.getInt("errorCode"));
                if (response.has("errorCode") && response.getInt("errorCode") == 0) {
                    if (response.has(SP_RESULTS)) {
                        JSONArray results = response.getJSONArray(SP_RESULTS);
                        if (results != null && results.length() > 2) {
                            JSONObject rst = (JSONObject) results.get(2);
                            if (rst != null && rst.has(ROWS)) {
                                JSONArray rowresult = rst.getJSONArray(ROWS);
                                if (rowresult != null && rowresult.length() > 0) {
                                    JSONArray row = (JSONArray) rowresult.get(0);
                                    if (row != null && row.length() > 0) {
                                        String errMsg = (String) row.get(0);
                                        String errCode = (String) row.get(1);
                                        if (Integer.parseInt(errCode) == 0) {
                                            LOGGER.info("User Authentication Service Success.=============");
                                            HttpSession session = httRequest.getSession();
                                            session.setAttribute("isLogged", true);
                                            session.setMaxInactiveInterval(SessionUtil.getInactiveInterval());
                                            session.setAttribute("userCode", userCode);
                                            SessionUtil.addValidSession(session);
                                            httpresponse.setHeader("auth_token", "JSESSIONID=" + session.getAttribute("userCode") + session.getId());
                                            LOGGER.info("HTTP Header set successfully, auth_token - JSESSIONID=" + session.getAttribute("userCode") + session.getId());
                                            LOGGER.info(response);
                                        } else {
                                            response = getErrorResponse(1, "User authentication failed");
                                            LOGGER.warn("User authentication failed with db error code and msg are " + errCode + " " + errMsg);
                                        }
                                    } else {
                                        response = getErrorResponse(1, "User authentication failed");
                                        LOGGER.warn("User authentication failed with no result rows.");
                                    }
                                } else {
                                    response = getErrorResponse(1, "User authentication failed");
                                    LOGGER.warn("User authentication failed with no result rows.");
                                }
                            } else {
                                response = getErrorResponse(1, "User authentication failed");
                                LOGGER.warn("User authentication failed with no result row object.");
                            }
                        } else {
                            response = getErrorResponse(1, "User authentication failed");
                            LOGGER.warn("User authentication failed with no result arrays.");
                        }
                    } else {
                        response = getErrorResponse(1, "User authentication failed");
                        LOGGER.warn("User authentication failed with no result.");
                    }
                } else {
                    response = getErrorResponse(1, "User authentication failed");
                    LOGGER.warn("User authentication failed with error " + response.get("errorCode"));
                }
            } else {
                response = getErrorResponse(1, "User authentication failed");
                LOGGER.warn("User authentication failed with null response");
            }
        } catch (Exception ex) {
            response = getErrorResponse(1, ex.getMessage());
            ex.printStackTrace();
            LOGGER.error(ex);
        }
        return response;
    }

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

    private JSONObject dbLogin(JSONObject detailObj, StringBuffer apiResponse, String rmtAddr, String Euser) {
        JSONObject response = new JSONObject();
        HTTPServiceRequest httpreq = null;
        JSONObject job = new JSONObject();
        String usrCode = "";
        try {
            LOGGER.info("tryyyyyy");

            if (detailObj != null && detailObj.has("UserCode")) {
//            if (detailObj != null && detailObj.has("UserCode") && detailObj.has("Password_Enc")) {

                LOGGER.info("dB CONNECTION ");

                JSONArray jarray = new JSONArray();
                JSONObject parm = new JSONObject();
                parm.put("UserCode", detailObj.get("UserCode"));

//                if (detailObj.has("CompanyId")) {
//
//                    String Authcode = ((detailObj.has("Authcode")) ? detailObj.getString("Authcode") : "");
//
//                    parm.put("CompanyId", Integer.parseInt(detailObj.getString("CompanyId")));
//                    parm.put("Authcode", Authcode);
//                } else {
//                    parm.put("CompanyId", 1);
//                    parm.put("Authcode", "");
//                }
                parm.put("Password", detailObj.get("Password"));
//                parm.put("Password", detailObj.get("Password_Enc"));
//                if (detailObj.has("LogUserType")) {
//                    parm.put("LogUserType", detailObj.getString("LogUserType") + "|" + rmtAddr + "|" + Euser);
//                } else {
//                    parm.put("LogUserType", "BO" + "|" + rmtAddr + "|" + Euser);
//                }
//                String xml = "";
//                if (apiResponse.toString() != null && !apiResponse.toString().equalsIgnoreCase("")) {
//                    JSONObject xmlRootObj = new JSONObject();
//                    JSONObject adXmlObj = new JSONObject();
//                    JSONObject adRespObj = new JSONObject(apiResponse.toString());
//                    adXmlObj.put("adresponse", adRespObj);
//                    xmlRootObj.put("root", adXmlObj);
//                    xml = leadServiceUtil.convertJsonToxml(xmlRootObj.toString());
//                }
//                if (xml == null || xml.equalsIgnoreCase("")) {
//                    xml = "";
//                }
//
//                LOGGER.info("data");
//
//                parm.put("XMLString", xml);

                jarray.put(parm);
                job.put(DBCONN, "db4");
                job.put(BATCHSTATUS, FALSE);
                job.put(DETAILARRAY, jarray);
                job.put(STOREDPROCID, 10026);
                job.put(OUTTBLCOUNT, STRING_ZERO);
                LOGGER.info("request sending to Db : " + job);
//                httpreq = new HTTPServiceRequest();
                DBReqProcessor db = new DBReqProcessor();
                JSONObject resp = db.executeSPFormated(job.toString());
//                JSONObject resp = httpreq.dbServiceCall(job.toString(), "/generaldbservice/ExecuteSPformated");
                LOGGER.info("Normal Login DB Resp : " + resp);
                response = resp;
                if (response != null) {
                    LOGGER.info("Resp : " + resp.has("errorCode"));
                    LOGGER.info("Resp : " + resp.getInt("errorCode"));
                    if (response.has("errorCode") && response.getInt("errorCode") == 0) {
                        if (response.has(SP_RESULTS)) {
                            JSONArray results = response.getJSONArray(SP_RESULTS);
                            System.out.println("results L  ==> "+results.length());
                            if (results != null && results.length() > 1) {
                                JSONObject rst = (JSONObject) results.get(1);
                                if (rst != null && rst.has(ROWS)) {
                                    JSONArray rowresult = rst.getJSONArray(ROWS);
                                    if (rowresult != null && rowresult.length() > 0) {
                                        JSONArray row = (JSONArray) rowresult.get(0);
                                        if (row != null && row.length() > 0) {
                                          
                                            String errMsg = (String) row.get(0);
                                            String errCode = String.valueOf(row.get(1));
                                           
                                            if (Integer.parseInt(errCode) == 0) {
                                                LOGGER.info("User Authentication Success.=============");

                                                // Fetching the user code from the response
                                                JSONObject rst1 = (JSONObject) results.get(0);
                                                if (rst1 != null && rst1.has(ROWS)) {
                                                    JSONArray rowresult1 = rst1.getJSONArray(ROWS);
                                                    if (rowresult1 != null && rowresult1.length() > 0) {
                                                        JSONArray row1 = (JSONArray) rowresult1.get(0);
                                                        if (row1 != null && row1.length() > 0) {
                                                            usrCode = (String) row1.get(4);
                                                            
                                                            System.out.println("usercodeeeeeee==> "+usrCode);
                                                        }
                                                    }
                                                }

                                                HttpSession session = httRequest.getSession();
                                                session.setAttribute("isLogged", true);
                                                session.setAttribute("userCode",  detailObj.get("UserCode"));
                                                session.setMaxInactiveInterval(SessionUtil.getInactiveInterval());
//                            
                                                SessionUtil.addValidSession(session);
                                                httpresponse.setHeader("auth_token", "JSESSIONID=" + session.getId());
                                                LOGGER.info("HTTP Header set successfully, auth_token - JSESSIONID=" + session.getAttribute("userCode") + session.getId());
                                         
                                                LOGGER.info(response);
                                                } else {
                                                response = getErrorResponse(1, "User authentication failed");
                                                LOGGER.warn("User authentication failed with db error code and msg are " + errCode + " " + errMsg);
                                            }
                                        } else {
                                            response = getErrorResponse(1, "User authentication failed");
                                            LOGGER.warn("User authentication failed with no result rows.");
                                        }
                                    } else {
                                        response = getErrorResponse(1, "User authentication failed");
                                        LOGGER.warn("User authentication failed with no result rows.");
                                    }
                                } else {
                                    response = getErrorResponse(1, "User authentication failed");
                                    LOGGER.warn("User authentication failed with no result row object.");
                                }
                            } else {
                                JSONArray row = results.getJSONObject(0).getJSONArray("rows").getJSONArray(0);
                                response = getErrorResponse(1, row.getString(2));
                                LOGGER.warn("User authentication failed with no result arrays.");
                            }
                        } else {
                            response = getErrorResponse(1, "User authentication failed");
                            LOGGER.warn("User authentication failed with no result.");
                        }
                    } else {
                        response = getErrorResponse(1, "User authentication failed");
                        LOGGER.warn("User authentication failed with error " + response.get("errorCode"));
                    }
                } else {
                    response = getErrorResponse(1, "User authentication failed");
                    LOGGER.warn("User authentication failed with null response");
                }
            } else {
                response = getErrorResponse(3, "Invalid login request");
                LOGGER.error("Invalid login request");
            }
        } catch (Exception ex) {
            response = getErrorResponse(1, ex.getMessage());
            ex.printStackTrace();
            LOGGER.error(ex);
        }
        return response;
    }
}
