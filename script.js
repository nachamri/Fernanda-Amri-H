document.getElementById("mode-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    this.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    document.body.style.transition = "background 0.5s ease, color 0.5s ease";
});

let dataList = JSON.parse(localStorage.getItem("dataList")) || [];
let saldoAkhir = parseInt(localStorage.getItem("saldoAkhir")) || 0;
let editIndex = -1;

document.querySelectorAll(".nominal-btn").forEach(button => {
    button.addEventListener("click", function () {
        document.querySelectorAll(".nominal-btn").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        this.style.transform = "scale(1.1)";
        setTimeout(() => this.style.transform = "scale(1)", 200);
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

    // Geser tombol tambah lebih ke atas
    tambahBtn.style.marginTop = "100px";
    
    // Efek animasi tombol tambah
    tambahBtn.style.transform = "scale(1.1)";
    setTimeout(() => tambahBtn.style.transform = "scale(1)", 200);
    
    if (editIndex === -1) {
        dataList.push({ deskripsi, tanggal, nominal });
        saldoAkhir += nominal;
    } else {
        saldoAkhir -= dataList[editIndex].nominal;
        dataList[editIndex] = { deskripsi, tanggal, nominal };
        saldoAkhir += nominal;
        editIndex = -1;
        document.querySelector(".tambah-btn").textContent = "Tambahh...";
    }

    localStorage.setItem("dataList", JSON.stringify(dataList));
    localStorage.setItem("saldoAkhir", saldoAkhir);
    renderTable();
    resetForm();
}

function renderTable() {
    let tbody = document.querySelector("#data-table tbody");
    tbody.innerHTML = "";
    dataList.forEach((data, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.deskripsi}</td>
            <td>${data.tanggal}</td>
            <td>Rp ${data.nominal.toLocaleString()}</td>
            <td>
                <button class="edit-btn" onclick="editData(${index})">✏️ Edit</button>
                <button class="hapus-btn" onclick="hapusData(${index})">🗑 Hapus</button>
            </td>
        `;
        row.style.opacity = "0";
        row.style.transform = "translateY(10px)";
        tbody.appendChild(row);
        setTimeout(() => {
            row.style.opacity = "1";
            row.style.transform = "translateY(0)";
            row.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        }, 100);
    });
    document.getElementById("saldoAkhir").textContent = `Rp ${saldoAkhir.toLocaleString()}`;
}

function editData(index) {
    let data = dataList[index];
    document.getElementById("deskripsi").value = data.deskripsi;
    document.getElementById("tanggal").value = data.tanggal;
    document.querySelectorAll(".nominal-btn").forEach(btn => {
        if (parseInt(btn.dataset.value) === data.nominal) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    editIndex = index;
    document.querySelector(".tambah-btn").textContent = "Update";
}

function hapusData(index) {
    saldoAkhir -= dataList[index].nominal;
    dataList.splice(index, 1);
    localStorage.setItem("dataList", JSON.stringify(dataList));
    localStorage.setItem("saldoAkhir", saldoAkhir);
    renderTable();
}

renderTable();
