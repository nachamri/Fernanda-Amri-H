document.getElementById("mode-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    this.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

let dataList = JSON.parse(localStorage.getItem("dataList")) || [];
let saldoAkhir = parseInt(localStorage.getItem("saldoAkhir")) || 0;
let editIndex = -1;

document.querySelectorAll(".nominal-btn").forEach(button => {
    button.addEventListener("click", function () {
        document.querySelectorAll(".nominal-btn").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
    });
});

function tambahData() {
    let deskripsi = document.getElementById("deskripsi").value;
    let tanggal = document.getElementById("tanggal").value;
    let nominalBtn = document.querySelector(".nominal-btn.active");

    if (!deskripsi || !tanggal || !nominalBtn) {
        alert("Harap isi semua data!");
        return;
    }

    let nominal = parseInt(nominalBtn.dataset.value);
    let tambahBtn = document.querySelector(".tambah-btn");

    // 🔹 Efek perubahan warna saat tombol ditekan
    tambahBtn.style.background = "#ff5733";  // Ubah warna menjadi merah saat diklik
    setTimeout(() => {
        tambahBtn.style.background = "#28a745";  // Kembali ke warna hijau setelah 300ms
    }, 300);

    if (editIndex === -1) {
        dataList.push({ deskripsi, tanggal, nominal });
        saldoAkhir += nominal;
    } else {
        saldoAkhir -= dataList[editIndex].nominal;
        dataList[editIndex] = { deskripsi, tanggal, nominal };
        saldoAkhir += nominal;
        editIndex = -1;
        document.querySelector(".tambah-btn").textContent = "Tambah";
    }

    localStorage.setItem("dataList", JSON.stringify(dataList));
    localStorage.setItem("saldoAkhir", saldoAkhir);
    renderTable();
    resetForm();
}

function editData(index) {
    document.getElementById("deskripsi").value = dataList[index].deskripsi;
    document.getElementById("tanggal").value = dataList[index].tanggal;

    let buttons = document.querySelectorAll(".nominal-btn");
    buttons.forEach(button => {
        if (parseInt(button.dataset.value) === dataList[index].nominal) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });

    editIndex = index;
    document.querySelector(".tambah-btn").textContent = "Perbarui";
}

function hapusData(index) {
    saldoAkhir -= dataList[index].nominal;
    dataList.splice(index, 1);

    localStorage.setItem("dataList", JSON.stringify(dataList));
    localStorage.setItem("saldoAkhir", saldoAkhir);
    renderTable();
}

function renderTable() {
    let tbody = document.querySelector("#data-table tbody");
    tbody.innerHTML = dataList.map((data, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${data.deskripsi}</td>
            <td>${data.tanggal}</td>
            <td>Rp ${data.nominal.toLocaleString()}</td>
            <td>
                <button class="edit-btn" onclick="editData(${index})">✏️ Edit</button>
                <button class="hapus-btn" onclick="hapusData(${index})">🗑 Hapus</button>
            </td>
        </tr>
    `).join("");
    document.getElementById("saldoAkhir").textContent = `Rp ${saldoAkhir.toLocaleString()}`;
}

function resetForm() {
    document.getElementById("deskripsi").value = "";
    document.getElementById("tanggal").value = "";
    document.querySelectorAll(".nominal-btn").forEach(button => button.classList.remove("active"));
}

renderTable();
