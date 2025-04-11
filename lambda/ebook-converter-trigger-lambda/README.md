# S3 Trigger Lambda Function

Lambda function để kích hoạt EC2 khi có file được upload lên S3.

## Triển khai

1. Nén các file trong thư mục này thành một file ZIP:  
   zip -r s3-trigger-lambda.zip .

less

2. Tạo Lambda function trong AWS Console:
    - Vào AWS Lambda Console
    - Chọn "Create function"
    - Chọn "Author from scratch"
    - Đặt tên cho function
    - Chọn Runtime: Node.js 18.x
    - Chọn hoặc tạo execution role với quyền S3 ReadOnly

3. Upload ZIP file:
    - Trong trang Configuration của Lambda, chọn "Upload from" > ".zip file"
    - Upload file s3-trigger-lambda.zip

4. Cấu hình biến môi trường:
    - Thêm biến môi trường EC2_API_ENDPOINT: URL đến EC2 instance
    - Thêm biến môi trường S3_ORIGINAL_PREFIX: Thư mục chứa file gốc (thường là "original/")

5. Cấu hình trigger từ S3:
    - Chọn "Add trigger"
    - Chọn S3
    - Chọn bucket của bạn
    - Event type: chọn "All object create events"
    - Prefix: thêm "original/" để chỉ kích hoạt khi file được upload vào thư mục này
    - Suffix: thêm ".mobi,.azw,.azw3" để chỉ kích hoạt với các định dạng phù hợp

6. Cấu hình timeout:
    - Trong phần "Basic settings", đặt Timeout là 30 giây

7. Lưu cấu hình và kiểm tra bằng cách upload một file thử lên S3  