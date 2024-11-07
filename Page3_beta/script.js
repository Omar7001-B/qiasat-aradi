// Select input elements and other relevant elements
let shares = document.querySelector("#share-input");
let carat = document.querySelector("#carat-input");
let acre = document.querySelector("#acre-input");
let cm = document.querySelector("#cm");
let delete_btn = document.querySelector("#delete-btn");
let calc_btn = document.querySelector("#calc-btn");
let table_rows = document.querySelectorAll(".table-input");
let each_carat = document.querySelector(".each-carat");
let total = document.querySelector("#total");
let result_shares = document.querySelector(".result-shares");
let result_carat = document.querySelector(".result-carat");
let result_acre = document.querySelector(".result-acre");
let old_width = document
  .querySelector(".width-old")
  .querySelectorAll("td:not(:first-child)");
let each_old = document
  .querySelector(".each-old")
  .querySelectorAll("td:not(:first-child)");
let last_table_inputs = document.querySelectorAll(".table-input:not(#total)")[
  document.querySelectorAll(".table-input:not(#total)").length - 1
];

// Load data from sessionStorage when the page loads
window.onload = function () {
  loadData();
};

// Toggle Button
let isTableInMeter = true;
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggle-btn");
  const tableHeader = document.querySelector(".table-header"); // Select table header
  const meterOrFist = document.querySelector("#cm");

  const tableInputs = document.querySelectorAll(".table-input"); // Select all rows in the table
  const titleDiv = document.querySelector(".title");
  const pElement = document.querySelector(
    "body > div > div.s.s3 > div.results > div.result-left > p"
  );
  const h3Element = document.querySelector("body > div > div.s.s2 > h3");
  const one_carat_width = document.querySelector(
    "body > div > div.s.s3 > div.results > div.result-left > span"
  );

  toggleBtn.addEventListener("click", function () {
    isTableInMeter = !isTableInMeter;
    console.log("isTableInMeter:", isTableInMeter);
    toggleBtn.innerText = isTableInMeter ? "حول الى قبضة" : "حول الى متر";

    if (isTableInMeter) {
      meterOrFist.value = convertFistsToMeters(meterOrFist.value).toFixed(3);
      one_carat_width.innerText = convertFistsToMeters(
        one_carat_width.innerText
      ).toFixed(3);
      titleDiv.querySelector("h1").textContent =
        "فصل الحد بين المزارعين بالمتر";

      pElement.textContent = "عرض القيراط الواحد بالمتر";
      h3Element.textContent = "إدخال إجمالي عرض المساحة (بالمتر)";

      titleDiv.querySelector("img").src = "../imgs/1.png";

      tableInputs.forEach((row) => {
        const secondToLastInput =
          row.querySelectorAll("input")[
            row.querySelectorAll("input").length - 2
          ];
        secondToLastInput.value = convertFistsToMeters(
          secondToLastInput.value
        ).toFixed(3);
      });
    } else {
      meterOrFist.value = convertMetersToFists(meterOrFist.value).toFixed(3);
      one_carat_width.innerText = convertMetersToFists(
        one_carat_width.innerText
      ).toFixed(3);
      titleDiv.querySelector("h1").textContent =
        "فصل الحد بين المزارعين بالقبضه";
      pElement.textContent = "عرض القيراط الواحد بالقبضة";
      h3Element.textContent = "إدخال إجمالي عرض المساحة (بالقبضة)";

      titleDiv.querySelector("img").src = "../imgs/fist.png";

      tableInputs.forEach((row) => {
        const secondToLastInput =
          row.querySelectorAll("input")[
            row.querySelectorAll("input").length - 2
          ];
        secondToLastInput.value = convertMetersToFists(
          secondToLastInput.value
        ).toFixed(3);
      });
    }

    // Update table header based on the mode
    tableHeader.innerHTML = isTableInMeter
      ? `
      <p>سهم</p>
      <p>قيراط</p>
      <p>العرض الحالي بالمتر</p>
      <p>العرض السابق بالمتر</p>
      <p>الفرق بين العرضين بالمتر</p>
    `
      : `
      <p>سهم</p>
      <p>قيراط</p>
      <p>العرض الحالي بالقبضه</p>
      <p>العرض السابق بالقبضه</p>
      <p>الفرق بين العرضين بالقبضه</p>
    `;

    showDownPart(isTableInMeter);

    // Loop through each .table-input element and trigger the run function
    tableInputs.forEach(function (row) {
      // only run
      row.querySelectorAll("input").forEach(function (cell) {
        run(cell, true);
      });
    });
  });
});

// Function to save input field data to sessionStorage
function saveData() {
  sessionStorage.setItem("shares", shares.value);
  sessionStorage.setItem("carat", carat.value);
  sessionStorage.setItem("acre", acre.value);
  sessionStorage.setItem("cm", cm.value);
  old_width.forEach((e, index) => {
    sessionStorage.setItem(`old_width_${index}`, e.innerText);
  });
  document
    .querySelectorAll(".table-input:not(#total)")
    .forEach((row, rowIndex) => {
      row.querySelectorAll("input").forEach((input, inputIndex) => {
        sessionStorage.setItem(
          `table_input_${rowIndex}_${inputIndex}`,
          input.value
        );
      });
    });
}

// Function to retrieve and set input field data from sessionStorage
function loadData() {
  shares.value = sessionStorage.getItem("shares") || "";
  carat.value = sessionStorage.getItem("carat") || "";
  acre.value = sessionStorage.getItem("acre") || "";
  cm.value = sessionStorage.getItem("cm") || "";
  old_width.forEach((e, index) => {
    e.innerText = sessionStorage.getItem(`old_width_${index}`) || "";
  });
  document
    .querySelectorAll(".table-input:not(#total)")
    .forEach((row, rowIndex) => {
      row.querySelectorAll("input").forEach((input, inputIndex) => {
        input.value =
          sessionStorage.getItem(`table_input_${rowIndex}_${inputIndex}`) || "";
      });
    });
}

// Add event listeners to save data on input change
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", saveData);
});

// The rest of your original code
listen_to_last(last_table_inputs.children);
function listen_to_last(last_table_inputs) {
  for (let i = 0; i < last_table_inputs.length - 1; i++) {
    last_table_inputs[i].addEventListener("input", inputlistener);
  }
}
function inputlistener() {
  for (let j = 0; j < last_table_inputs.children.length - 1; j++) {
    last_table_inputs.children[j].removeEventListener("input", inputlistener);
  }
  last_table_inputs = document.createElement("div");
  last_table_inputs.className = "table-input";
  last_table_inputs.innerHTML = `
          <input type="number">
          <input type="number">
          <input type="text" readonly>
          <input type="number">
          <input type="text" readonly>
        `;
  document
    .querySelector(".table")
    .insertBefore(last_table_inputs, document.querySelector("#total"));

  last_table_inputs.querySelectorAll("input").forEach((e) => {
    e.addEventListener("input", () => {
      run(e);
      saveData(); // Save data when input changes
    });
  });
  listen_to_last(last_table_inputs.children);
  saveData(); // Save data after new row is added
}

old_width.forEach((e) => {
  e.addEventListener("input", () => {
    let total_cm = (
      (((Number(old_width[0].innerText) + Number(old_width[1].innerText)) / 24 +
        Number(old_width[2].innerText)) /
        100) *
      14.7916666667 *
      24
    ).toFixed(3);
    cm.value = total_cm;
    saveData(); // Save data when input changes
  });
});
for (let i = 0; i < total.children.length; i++) {
  total.children[i].value = "0";
}
delete_btn.addEventListener("click", () => {
  document.querySelectorAll("input").forEach((e) => {
    e.value = "";
  });
  sessionStorage.clear(); // Clear session storage on delete
});
document
  .querySelectorAll(
    "input:not(.table-input input), .width-old td:not(:first-child)"
  )
  .forEach((x) => {
    x.addEventListener("input", () => {
      document
        .querySelectorAll(".table-input:not(#total) input")
        .forEach((e) => {
          run(e);
        });
    });
  });
document.querySelectorAll(".table-input:not(#total) input").forEach((e) => {
  e.addEventListener("input", () => {
    run(e);
  });
});

function convertMetersToFists(meters) {
  const centimeters = meters * 100; // Convert meters to centimeters
  const fists = centimeters / 14.7916666667; // Calculate total fists

  return fists;
}

function convertFistsToMeters(fists) {
  const centimeters = fists * 14.7916666667; // Convert fists to centimeters
  const meters = centimeters / 100; // Calculate total meters

  return meters;
}

function run(e, isConvertClicked = false) {
  console.log(e);
  console.log("isTableInMeter : ", isTableInMeter);
  let parent = e.parentElement;
  let real_width = total_carat_table(e.parentElement) * result_each();
  // if (isTableInMeter) {
  //   real_width = convertMetersToFists(real_width);
  // }
  // if (isConvertClicked) {
  //   if (isTableInMeter) {
  //     parent.children[3].value = convertMetersToFists(parent.children[3].value);
  //   } else {
  //     parent.children[3].value = convertFistsToMeters(parent.children[3].value);
  //   }
  // }

  parent.children[2].value = parseFloat(real_width.toFixed(3));

  if (parent.children[3].value != "") {
    parent.children[4].value = parseFloat(
      (real_width - parent.children[3].value).toFixed(3)
    );
  }
  if (parent.children[4].value < 0) {
    parent.children[4].style.color = "red";
  } else {
    parent.children[4].style.color = "green";
  }
  for (let i = 0; i < total.children.length; i++) {
    total.children[i].value = "";
  }
  document.querySelectorAll(".table-input:not(#total)").forEach((e) => {
    total.children[0].value = parseFloat(
      (Number(total.children[0].value) + Number(e.children[0].value)).toFixed(3)
    );
    while (Number(total.children[0].value) >= 24) {
      total.children[0].value = Number(total.children[0].value) - 24;
      total.children[1].value = Number(total.children[1].value) + 1;
    }
    total.children[1].value = parseFloat(
      (Number(total.children[1].value) + Number(e.children[1].value)).toFixed(3)
    );
    total.children[2].value = (
      Number(total.children[2].value) + Number(e.children[2].value)
    ).toFixed(2);
    total.children[3].value = (
      Number(total.children[3].value) + Number(e.children[3].value)
    ).toFixed(2);
    total.children[4].value = (
      Number(total.children[4].value) + Number(e.children[4].value)
    ).toFixed(2);
  });
  let total_shares_input = total_carat() * 24;
  let total_shares_table =
    Number(total.children[0].value) + Number(total.children[1].value) * 24;
  let diff_total = Number((total_shares_input - total_shares_table).toFixed(4));
  result_acre.innerText = parseInt(diff_total / 24 / 24);
  diff_total = diff_total % (24 * 24);
  result_carat.innerText = parseInt(diff_total / 24);
  result_shares.innerText = parseFloat((diff_total % 24).toFixed(3));
  // Set text color based on negative or non-negative value
  result_acre.style.color = result_acre.innerText < 0 ? "red" : "black";
  result_carat.style.color = result_carat.innerText < 0 ? "red" : "black";
  result_shares.style.color = result_shares.innerText < 0 ? "red" : "black";
  saveData();
}

function result_each() {
  if (total_carat() == 0) return 0;
  return Number(cm.value) / total_carat() || 0;
}
document
  .querySelectorAll(
    "input:not(.table-input input), .width-old td:not(:first-child)"
  )
  .forEach((e) => {
    e.addEventListener("input", () => {
      if (isTableInMeter) each_carat.innerText = result_each().toFixed(3);
      else
        each_carat.innerText = convertMetersToFists(result_each()).toFixed(3);

      let each_carat_value = Number(result_each());
      each_old[0].innerText = meter_to_old(each_carat_value, "num1");
      each_old[1].innerText = meter_to_old(each_carat_value, "num2");
      each_old[2].innerText = meter_to_old(each_carat_value, "num3");
      saveData(); // Save data when input changes
    });
  });

function total_carat() {
  return (
    Number(acre.value) * 24 + Number(carat.value) + Number(shares.value) / 24
  );
}
function total_carat_table(e) {
  return Number(e.children[0].value / 24) + Number(e.children[1].value);
}
cm.addEventListener("input", () => {
  let meter = Number(cm.value);
  old_width[0].innerText = meter_to_old(meter, "num1");
  old_width[1].innerText = meter_to_old(meter, "num2");
  old_width[2].innerText = meter_to_old(meter, "num3");
  saveData(); // Save data when input changes
});

function meter_to_old(number, num) {
  number = (number * 100) / 14.7916666667 / 24;
  let num1 = Math.floor(number);
  let num2 = Math.floor(getfloor(number) * 24);
  let num3 = getfloor(getfloor(number) * 24).toFixed(3);
  if (num3 == 1) {
    num3 -= 1;
    num2 += 1;
  }
  if (num2 == 24) {
    num2 -= 24;
    num1 += 1;
  }
  return num == "num3"
    ? num1 || 0
    : num == "num2"
    ? num2 || 0
    : num == "num1"
    ? num3 || 0
    : "";
}

function old_to_meter(number, num) {}
function getfloor(num) {
  let tostr = num.toString();
  if (tostr.includes(".")) {
    let result = tostr.slice(tostr.indexOf("."));
    return Number(result);
  } else {
    return 0;
  }
}

function showDownPart(isVisible) {
  const section = document.querySelector(".s4");
  if (isVisible) {
    section.style.display = "block"; // Make the section visible
  } else {
    section.style.display = "none"; // Hide the section
  }
}