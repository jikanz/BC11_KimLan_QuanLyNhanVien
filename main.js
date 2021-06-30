var danhSachNV = new DanhSachNV();
var validation = new Validation();
getLocalStrorage();
function getEle(id) {
  return document.getElementById(id);
}
function layThongTinNV(isAdd) {
  // lấy thông tin user nhạp vào
  var maNV = getEle("tknv").value;
  var tenNV = getEle("name").value;
  var email = getEle("email").value;
  var password = getEle("password").value;
  var date = getEle("datepicker").value;
  var luong = getEle("luongCB").value;
  var chucVu = getEle("chucvu").value;
  var time = getEle("gioLam").value;
  var kiemTra = true;

  if (isAdd) {
    kiemTra &=
      validation.kiemTraRong(maNV, "tbTKNV", "(*) vui lòng nhập") &&
      validation.kiemTraDoDaiKyTu(
        maNV,
        "tbTKNV",
        "(*)vui lòng nhập 4-6 số ",
        4,
        6
      ) &&
      validation.kiemTraMaTrung(maNV, "tbTKNV", "(*) Trùng", danhSachNV.list);
  }

  kiemTra &=
    validation.kiemTraRong(tenNV, "tbTen", "(*) vui lòng nhập") &&
    validation.kiemTraso(tenNV, "tbTen", "(*) vui lòng nhập chữ cái từ a-z");

  kiemTra &=
    validation.kiemTraRong(email, "tbEmail", "(*) vui lòng nhập") &&
    validation.kiemTraEmail(email, "tbEmail", "k hợp lệ");

  kiemTra &=
    validation.kiemTraRong(password, "tbMatKhau", "(*) vui lòng nhập") &&
    validation.kiemTraPass(password, "tbMatKhau", "mật khẩu k an toàn");

  kiemTra &= validation.kiemTraRong(date, "tbNgay", "(*) vui lòng nhập");
  kiemTra &= validation.kiemTraChucVu(
    "chucvu",
    "tbChucVu",
    "(*) vui lòng nhập"
  );
  kiemTra &=
    validation.kiemTraRong(luong, "tbLuongCB", "(*) vui lòng nhập") &&
    validation.kiemTraLuong(
      luong,
      "tbLuongCB",
      "vui lòng nhập 1tr-20tr",
      1000000,
      20000000
    );
  kiemTra &=
    validation.kiemTraRong(time, "tbGiolam", "(*) vui lòng nhập") &&
    validation.kiemTraLuong(time, "tbGiolam", "vui lòng nhập 80-200", 80, 200);
  if (kiemTra) {
    // khởi tạo đối tượng NV
    var nhanVien = new NhanVien(
      maNV,
      tenNV,
      email,
      password,
      date,
      luong,
      chucVu,
      time
    );
    //tính điểm tb
    nhanVien.tinhTongLuong();
    nhanVien.xepLoai();
    return nhanVien;
  }
  return null;
}
getEle("btnThemNV").addEventListener("click", function () {
  var nhanVien = layThongTinNV(true);
  if (!nhanVien) return;
  danhSachNV.themNV(nhanVien);
  taoBang(danhSachNV.list);
  setLocalStrorage();
  console.log(123);
});
function taoBang(arr) {
  var contentHTML = "";
  for (var i = 0; i < arr.length; i++) {
    contentHTML += `
    <tr>
    <td>${arr[i].maNV}</td>
    <td>${arr[i].tenNV}</td>
    <td>${arr[i].email}</td>
    <td>${arr[i].date}</td>
    <td>${arr[i].chucVu}</td>
    <td>${arr[i].tinhTongLuong}</td>
    <td>${arr[i].xepLoai}</td>
      <td><button class="btn btn-info" onclick="btnXoa('${arr[i].maNV}')">Xóa</button>
        <button class="btn btn-danger" data-toggle="modal" data-target="#myModal" onclick="btnSua('${arr[i].maNV}')">Sửa</button>
    </td>
    </tr>
    `;
  }
  getEle("tableDanhSach").innerHTML = contentHTML;
}
function btnXoa(maNV) {
  danhSachNV.xoaNV(maNV);
  taoBang(danhSachNV.list);
  setLocalStrorage();
}
function btnSua(maNV) {
  var nhanVien = danhSachNV.suaNV(maNV);
  if (nhanVien) {
    getEle("tknv").value = nhanVien.maNV;
    getEle("name").value = nhanVien.tenNV;
    getEle("email").value = nhanVien.email;
    getEle("password").value = nhanVien.password;
    getEle("datepicker").value = nhanVien.date;
    getEle("luongCB").value = nhanVien.luong;
    getEle("chucvu").value = nhanVien.chucVu;
    getEle("gioLam").value = nhanVien.time;
  }
}
getEle("btnCapNhat").addEventListener("click", function () {
  var nhanVien = layThongTinNV(false);
  if (nhanVien) {
    danhSachNV.capNhatNV(nhanVien);
    taoBang(danhSachNV.list);
    setLocalStrorage();
  }
});
getEle("searchName").addEventListener("keyup", function () {
  var keyword = getEle("searchName").value;
  var arrTimKiem = danhSachNV.timKiem(keyword);
  taoBang(arrTimKiem);
});
function setLocalStrorage() {
  var arrString = JSON.stringify(danhSachNV.list);
  localStorage.setItem("DSNV", arrString);
}
function getLocalStrorage() {
  if (localStorage.getItem("DSNV")) {
    danhSachNV.list = JSON.parse(localStorage.getItem("DSNV"));
    taoBang(danhSachNV.list);
  }
}
