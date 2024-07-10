# coding=utf-8
"""
    @project: qabot
    @Author：虎
    @file： exception_code_constants.py
    @date：2023/9/4 14:09
    @desc: 异常常量类
"""
from enum import Enum

from common.exception.app_exception import AppApiException


class ExceptionCodeConstantsValue:
    def __init__(self, code, message):
        self.code = code
        self.message = message

    def get_message(self):
        return self.message

    def get_code(self):
        return self.code

    def to_app_api_exception(self):
        return AppApiException(code=self.code, message=self.message)


class ExceptionCodeConstants(Enum):
    INCORRECT_USERNAME_AND_PASSWORD = ExceptionCodeConstantsValue(1000, "Incorrect username or password")
    NOT_AUTHENTICATION = ExceptionCodeConstantsValue(1001, "Please login first and include user Token")
    EMAIL_SEND_ERROR = ExceptionCodeConstantsValue(1002, "Failed to send email")
    EMAIL_FORMAT_ERROR = ExceptionCodeConstantsValue(1003, "Invalid email format")
    EMAIL_IS_EXIST = ExceptionCodeConstantsValue(1004, "Email already registered, please do not register again")
    EMAIL_IS_NOT_EXIST = ExceptionCodeConstantsValue(1005, "Email not registered, please register first")
    CODE_ERROR = ExceptionCodeConstantsValue(1005, "Incorrect verification code or code expired")
    USERNAME_IS_EXIST = ExceptionCodeConstantsValue(1006, "Username already in use, please use a different username")
    USERNAME_ERROR = ExceptionCodeConstantsValue(1006, "Username cannot be empty and must be 6-20 characters long")
    PASSWORD_NOT_EQ_RE_PASSWORD = ExceptionCodeConstantsValue(1007, "Password and confirm password do not match")
    USER_DISABLED = ExceptionCodeConstantsValue(1008, "User has been disabled, please contact the administrator!")
    EMAIL_NOT_SET = ExceptionCodeConstantsValue(1009, "Email not set, please contact the administrator to set it")
    EMAIL_SEND_FAIL = ExceptionCodeConstantsValue(1010, "Email sending failed")
    EMAIL_ALREADY_USED = ExceptionCodeConstantsValue(1011, "Email already in use")
    ADMIN_STATUS_CHANGE = ExceptionCodeConstantsValue(1012, "Cannot change administrator status")
    ADMIN_DELETE = ExceptionCodeConstantsValue(1013, "Cannot delete administrator")
    USER_NOT_FOUND = ExceptionCodeConstantsValue(1014, "User does not exist")
    EMAIL_SEND_LIMIT = ExceptionCodeConstantsValue(1015, "Please do not resend the email within {} seconds")
#
class ExceptionCodeConstants(Enum):
    INCORRECT_USERNAME_AND_PASSWORD = ExceptionCodeConstantsValue(1000, "用户名或者密码不正确")
    NOT_AUTHENTICATION = ExceptionCodeConstantsValue(1001, "请先登录,并携带用户Token")
    EMAIL_SEND_ERROR = ExceptionCodeConstantsValue(1002, "邮件发送失败")
    EMAIL_FORMAT_ERROR = ExceptionCodeConstantsValue(1003, "邮箱格式错误")
    EMAIL_IS_EXIST = ExceptionCodeConstantsValue(1004, "邮箱已经被注册,请勿重复注册")
    EMAIL_IS_NOT_EXIST = ExceptionCodeConstantsValue(1005, "邮箱尚未注册,请先注册")
    CODE_ERROR = ExceptionCodeConstantsValue(1005, "验证码不正确,或者验证码过期")
    USERNAME_IS_EXIST = ExceptionCodeConstantsValue(1006, "用户名已被使用,请使用其他用户名")
    USERNAME_ERROR = ExceptionCodeConstantsValue(1006, "用户名不能为空,并且长度在6-20")
    PASSWORD_NOT_EQ_RE_PASSWORD = ExceptionCodeConstantsValue(1007, "密码与确认密码不一致")
    USER_DISABLED = ExceptionCodeConstantsValue(1008, "用户已被禁用,请联系管理员!")
    EMAIL_NOT_SET = ExceptionCodeConstantsValue(1009, "邮箱未设置,请联系管理员设置")
    EMAIL_SEND_FAIL = ExceptionCodeConstantsValue(1010, "邮件发送失败")
    EMAIL_ALREADY_USED = ExceptionCodeConstantsValue(1011, "邮箱已经被使用")
    ADMIN_STATUS_CHANGE = ExceptionCodeConstantsValue(1012, "不能修改管理员状态")
    ADMIN_DELETE = ExceptionCodeConstantsValue(1013, "无法删除管理员")
    USER_NOT_FOUND = ExceptionCodeConstantsValue(1014, "用户不存在")
    EMAIL_SEND_LIMIT = ExceptionCodeConstantsValue(1015, "{}秒内请勿重复发送邮件")
