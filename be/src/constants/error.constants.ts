export const ErrorCode = {
    /*** Validation Errors - 1000 series ***/
    VALIDATION_ERROR: 'VALIDATION_ERROR',                  // Lỗi xác thực dữ liệu tổng quát
    INVALID_INPUT: 'INVALID_INPUT',                        // Dữ liệu đầu vào không hợp lệ
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',      // Thiếu trường bắt buộc
    INVALID_FORMAT: 'INVALID_FORMAT',                      // Định dạng không hợp lệ (email, phone, etc)
    INVALID_LENGTH: 'INVALID_LENGTH',                      // Độ dài không hợp lệ
    INVALID_VALUE: 'INVALID_VALUE',                        // Giá trị không hợp lệ
    INVALID_DATE: 'INVALID_DATE',                          // Ngày tháng không hợp lệ

    /*** Authentication Errors - 2000 series ***/
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',          // Lỗi xác thực tổng quát
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',            // Thông tin đăng nhập không hợp lệ
    INVALID_TOKEN: 'INVALID_TOKEN',                        // Token không hợp lệ
    EXPIRED_TOKEN: 'EXPIRED_TOKEN',                        // Token đã hết hạn
    TOKEN_VERIFICATION_FAILED: 'TOKEN_VERIFICATION_FAILED', // Xác thực token thất bại
    NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',                // Chưa xác thực
    INVALID_PASSWORD: 'INVALID_PASSWORD',                  // Mật khẩu không hợp lệ
    PASSWORD_MISMATCH: 'PASSWORD_MISMATCH',                // Mật khẩu không khớp
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',                      // Tài khoản bị khóa
    ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',                  // Tài khoản bị vô hiệu hóa
    ACCOUNT_NOT_VERIFIED: 'ACCOUNT_NOT_VERIFIED',          // Tài khoản chưa xác thực

    /*** Authorization Errors - 3000 series ***/
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',            // Lỗi ủy quyền tổng quát
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',   // Không đủ quyền
    ACCESS_DENIED: 'ACCESS_DENIED',                        // Từ chối truy cập
    RESOURCE_ACCESS_DENIED: 'RESOURCE_ACCESS_DENIED',      // Từ chối truy cập tài nguyên
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',                  // Hành động bị cấm
    QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',                      // Vượt quá quota
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',            // Vượt quá giới hạn tốc độ

    /*** Resource Errors - 4000 series ***/
    RESOURCE_ERROR: 'RESOURCE_ERROR',                      // Lỗi tài nguyên tổng quát
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',              // Tài nguyên không tìm thấy
    RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',    // Tài nguyên đã tồn tại
    RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',                // Xung đột tài nguyên
    RESOURCE_EXHAUSTED: 'RESOURCE_EXHAUSTED',              // Tài nguyên đã hết
    RESOURCE_EXPIRED: 'RESOURCE_EXPIRED',                  // Tài nguyên đã hết hạn
    RESOURCE_DELETED: 'RESOURCE_DELETED',                  // Tài nguyên đã bị xóa

    /*** Database Errors - 5000 series ***/
    DATABASE_ERROR: 'DATABASE_ERROR',                      // Lỗi database tổng quát
    DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR', // Lỗi kết nối database
    QUERY_ERROR: 'QUERY_ERROR',                            // Lỗi truy vấn
    TRANSACTION_ERROR: 'TRANSACTION_ERROR',                // Lỗi giao dịch
    UNIQUE_CONSTRAINT_ERROR: 'UNIQUE_CONSTRAINT_ERROR',    // Lỗi ràng buộc duy nhất
    FOREIGN_KEY_CONSTRAINT_ERROR: 'FOREIGN_KEY_CONSTRAINT_ERROR', // Lỗi khóa ngoại
    DEADLOCK_ERROR: 'DEADLOCK_ERROR',                      // Lỗi deadlock
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',                        // Lỗi timeout

    /*** Business Logic Errors - 6000 series ***/
    BUSINESS_ERROR: 'BUSINESS_ERROR',                      // Lỗi nghiệp vụ tổng quát
    INVALID_OPERATION: 'INVALID_OPERATION',                // Thao tác không hợp lệ
    OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',        // Thao tác không được phép
    BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',    // Vi phạm quy tắc nghiệp vụ
    PRECONDITION_FAILED: 'PRECONDITION_FAILED',            // Điều kiện tiên quyết không thỏa mãn
    INVALID_STATE_TRANSITION: 'INVALID_STATE_TRANSITION',  // Chuyển trạng thái không hợp lệ
    DEPENDENCY_ERROR: 'DEPENDENCY_ERROR',                  // Lỗi phụ thuộc

    /*** External Service Errors - 7000 series ***/
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',      // Lỗi dịch vụ bên ngoài tổng quát
    API_ERROR: 'API_ERROR',                                // Lỗi API
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',            // Dịch vụ không khả dụng
    EXTERNAL_DEPENDENCY_ERROR: 'EXTERNAL_DEPENDENCY_ERROR', // Lỗi phụ thuộc bên ngoài
    GATEWAY_ERROR: 'GATEWAY_ERROR',                        // Lỗi gateway
    INTEGRATION_ERROR: 'INTEGRATION_ERROR',                // Lỗi tích hợp
    NETWORK_ERROR: 'NETWORK_ERROR',                        // Lỗi mạng
    TIMEOUT: 'TIMEOUT',                                    // Timeout

    /*** File Errors - 8000 series ***/
    FILE_ERROR: 'FILE_ERROR',                              // Lỗi file tổng quát
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',                      // File không tìm thấy
    FILE_ALREADY_EXISTS: 'FILE_ALREADY_EXISTS',            // File đã tồn tại
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',                      // File quá lớn
    FILE_TYPE_NOT_SUPPORTED: 'FILE_TYPE_NOT_SUPPORTED',    // Loại file không được hỗ trợ
    FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',                // Lỗi upload file
    FILE_DOWNLOAD_ERROR: 'FILE_DOWNLOAD_ERROR',            // Lỗi download file
    FILE_CORRUPT: 'FILE_CORRUPT',                          // File bị hỏng
    FILE_PERMISSION_ERROR: 'FILE_PERMISSION_ERROR',        // Lỗi quyền truy cập file

    /*** System Errors - 9000 series ***/
    SYSTEM_ERROR: 'SYSTEM_ERROR',                          // Lỗi hệ thống tổng quát
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',        // Lỗi server nội bộ
    NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',                    // Chức năng chưa được cài đặt
    BAD_GATEWAY: 'BAD_GATEWAY',                            // Lỗi bad gateway
    CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',            // Lỗi cấu hình
    UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',                  // Lỗi không mong đợi
    DEPENDENCY_INJECTION_ERROR: 'DEPENDENCY_INJECTION_ERROR', // Lỗi dependency injection
    INITIALIZATION_ERROR: 'INITIALIZATION_ERROR',          // Lỗi khởi tạo
    SERVICE_SHUTDOWN: 'SERVICE_SHUTDOWN',                  // Dịch vụ đang tắt
} as const;

/**
 * ErrorMessage - Ánh xạ từ mã lỗi sang thông báo lỗi mặc định
 */
export const ErrorMessage = {
    /*** Validation Errors ***/
    [ErrorCode.VALIDATION_ERROR]: 'Lỗi xác thực dữ liệu.',
    [ErrorCode.INVALID_INPUT]: 'Dữ liệu đầu vào không hợp lệ.',
    [ErrorCode.MISSING_REQUIRED_FIELD]: 'Thiếu trường bắt buộc.',
    [ErrorCode.INVALID_FORMAT]: 'Định dạng không hợp lệ.',
    [ErrorCode.INVALID_LENGTH]: 'Độ dài không hợp lệ.',
    [ErrorCode.INVALID_VALUE]: 'Giá trị không hợp lệ.',
    [ErrorCode.INVALID_DATE]: 'Ngày tháng không hợp lệ.',

    /*** Authentication Errors ***/
    [ErrorCode.AUTHENTICATION_ERROR]: 'Lỗi xác thực.',
    [ErrorCode.INVALID_CREDENTIALS]: 'Thông tin đăng nhập không hợp lệ.',
    [ErrorCode.INVALID_TOKEN]: 'Token không hợp lệ.',
    [ErrorCode.EXPIRED_TOKEN]: 'Token đã hết hạn.',
    [ErrorCode.TOKEN_VERIFICATION_FAILED]: 'Xác thực token thất bại.',
    [ErrorCode.NOT_AUTHENTICATED]: 'Chưa xác thực.',
    [ErrorCode.INVALID_PASSWORD]: 'Mật khẩu không hợp lệ.',
    [ErrorCode.PASSWORD_MISMATCH]: 'Mật khẩu không khớp.',
    [ErrorCode.ACCOUNT_LOCKED]: 'Tài khoản đã bị khóa.',
    [ErrorCode.ACCOUNT_DISABLED]: 'Tài khoản đã bị vô hiệu hóa.',
    [ErrorCode.ACCOUNT_NOT_VERIFIED]: 'Tài khoản chưa được xác thực.',

    /*** Authorization Errors ***/
    [ErrorCode.AUTHORIZATION_ERROR]: 'Lỗi ủy quyền.',
    [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Không đủ quyền để thực hiện thao tác này.',
    [ErrorCode.ACCESS_DENIED]: 'Từ chối truy cập.',
    [ErrorCode.RESOURCE_ACCESS_DENIED]: 'Từ chối truy cập tài nguyên.',
    [ErrorCode.FORBIDDEN_ACTION]: 'Thao tác bị cấm.',
    [ErrorCode.QUOTA_EXCEEDED]: 'Đã vượt quá hạn mức cho phép.',
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Đã vượt quá số lần yêu cầu cho phép.',

    /*** Resource Errors ***/
    [ErrorCode.RESOURCE_ERROR]: 'Lỗi tài nguyên.',
    [ErrorCode.RESOURCE_NOT_FOUND]: 'Tài nguyên không tìm thấy.',
    [ErrorCode.RESOURCE_ALREADY_EXISTS]: 'Tài nguyên đã tồn tại.',
    [ErrorCode.RESOURCE_CONFLICT]: 'Xung đột tài nguyên.',
    [ErrorCode.RESOURCE_EXHAUSTED]: 'Tài nguyên đã hết.',
    [ErrorCode.RESOURCE_EXPIRED]: 'Tài nguyên đã hết hạn.',
    [ErrorCode.RESOURCE_DELETED]: 'Tài nguyên đã bị xóa.',

    /*** Database Errors ***/
    [ErrorCode.DATABASE_ERROR]: 'Lỗi cơ sở dữ liệu.',
    [ErrorCode.DATABASE_CONNECTION_ERROR]: 'Lỗi kết nối cơ sở dữ liệu.',
    [ErrorCode.QUERY_ERROR]: 'Lỗi truy vấn cơ sở dữ liệu.',
    [ErrorCode.TRANSACTION_ERROR]: 'Lỗi giao dịch cơ sở dữ liệu.',
    [ErrorCode.UNIQUE_CONSTRAINT_ERROR]: 'Vi phạm ràng buộc duy nhất.',
    [ErrorCode.FOREIGN_KEY_CONSTRAINT_ERROR]: 'Vi phạm ràng buộc khóa ngoại.',
    [ErrorCode.DEADLOCK_ERROR]: 'Lỗi deadlock trong cơ sở dữ liệu.',
    [ErrorCode.TIMEOUT_ERROR]: 'Thao tác cơ sở dữ liệu đã hết thời gian.',

    /*** Business Logic Errors ***/
    [ErrorCode.BUSINESS_ERROR]: 'Lỗi nghiệp vụ.',
    [ErrorCode.INVALID_OPERATION]: 'Thao tác không hợp lệ.',
    [ErrorCode.OPERATION_NOT_ALLOWED]: 'Thao tác không được phép.',
    [ErrorCode.BUSINESS_RULE_VIOLATION]: 'Vi phạm quy tắc nghiệp vụ.',
    [ErrorCode.PRECONDITION_FAILED]: 'Điều kiện tiên quyết không thỏa mãn.',
    [ErrorCode.INVALID_STATE_TRANSITION]: 'Chuyển trạng thái không hợp lệ.',
    [ErrorCode.DEPENDENCY_ERROR]: 'Lỗi phụ thuộc.',

    /*** External Service Errors ***/
    [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'Lỗi dịch vụ bên ngoài.',
    [ErrorCode.API_ERROR]: 'Lỗi API.',
    [ErrorCode.SERVICE_UNAVAILABLE]: 'Dịch vụ không khả dụng.',
    [ErrorCode.EXTERNAL_DEPENDENCY_ERROR]: 'Lỗi phụ thuộc bên ngoài.',
    [ErrorCode.GATEWAY_ERROR]: 'Lỗi gateway.',
    [ErrorCode.INTEGRATION_ERROR]: 'Lỗi tích hợp.',
    [ErrorCode.NETWORK_ERROR]: 'Lỗi mạng.',
    [ErrorCode.TIMEOUT]: 'Thời gian chờ đã hết.',

    /*** File Errors ***/
    [ErrorCode.FILE_ERROR]: 'Lỗi file.',
    [ErrorCode.FILE_NOT_FOUND]: 'Không tìm thấy file.',
    [ErrorCode.FILE_ALREADY_EXISTS]: 'File đã tồn tại.',
    [ErrorCode.FILE_TOO_LARGE]: 'File quá lớn.',
    [ErrorCode.FILE_TYPE_NOT_SUPPORTED]: 'Loại file không được hỗ trợ.',
    [ErrorCode.FILE_UPLOAD_ERROR]: 'Lỗi upload file.',
    [ErrorCode.FILE_DOWNLOAD_ERROR]: 'Lỗi download file.',
    [ErrorCode.FILE_CORRUPT]: 'File bị hỏng.',
    [ErrorCode.FILE_PERMISSION_ERROR]: 'Lỗi quyền truy cập file.',

    /*** System Errors ***/
    [ErrorCode.SYSTEM_ERROR]: 'Lỗi hệ thống.',
    [ErrorCode.INTERNAL_SERVER_ERROR]: 'Lỗi server nội bộ.',
    [ErrorCode.NOT_IMPLEMENTED]: 'Chức năng chưa được cài đặt.',
    [ErrorCode.BAD_GATEWAY]: 'Lỗi bad gateway.',
    [ErrorCode.CONFIGURATION_ERROR]: 'Lỗi cấu hình.',
    [ErrorCode.UNEXPECTED_ERROR]: 'Lỗi không mong đợi.',
    [ErrorCode.DEPENDENCY_INJECTION_ERROR]: 'Lỗi dependency injection.',
    [ErrorCode.INITIALIZATION_ERROR]: 'Lỗi khởi tạo.',
    [ErrorCode.SERVICE_SHUTDOWN]: 'Dịch vụ đang tắt.',
} as const;