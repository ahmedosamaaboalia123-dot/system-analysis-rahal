# خريطة السياق

الحدود: التطبيقات ← API versioned contracts ← المجالات المالكة. التكامل بين المجالات يتم بعقد API أو event outbox فقط. لا توجد كتابة مباشرة عبر schema. Location يملك GPS؛ Booking يملك الحجز؛ Wallet يملك دفتر الحقيقة المالي؛ Queue يملك الترتيب؛ Vehicles يملك بيانات المركبة الأساسية.