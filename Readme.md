###                  SỬ DỤNG BẢN ĐỒ ĐỂ THỂ HIỆN TỌA ĐỘ CỦA TÀU MẶT NƯỚC KHÔNG NGƯỜI LÁI (USV) TRÊN BẢN ĐỒ BẰNG GIAO THỨC MQTT
Công nghệ: C#, javascript, html, MQTT, signalR.

## Mô tả:
   Sử dụng html và javascript với Googlemap API để thể hiện tọa độ của tàu theo con trỏ màu đỏ được hiện ở trên phần mềm.
   Giao thức truyền nhận dữ liệu: MQTT. Ta sử dụng Service MQTT bằng C# để nhận dữ liệu và truyền dữ liệu giữa phần mềm và tàu. Giữa class MQTT và javascript ta sử dụng SignalR như một broker để update dữ liệu qua lại.
   Dữ liệu của tàu được thể hiện một cách Realtime.

 ```
Cách sử dụng:
  Khởi động phần mềm
  Sau khi khởi động thì sẽ xuất hiện giao diện với 2 button xanh là googlemap và chart
  ấn vào Googlemap: 
    + Center button : đưa marker về trung tâm
    + Click vào màn hình sẽ tạo ra các note 
    + Thanh công cụ ở trên top để xóa các note hoặc ẩn các note đã đánh dấu

  Chart:
  + Ẩn các option hình bằng cách click vào ô vuông của option trên đồ thị
```
