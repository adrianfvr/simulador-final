"use strict";

// Variables
const table = document.getElementById("calculator-table"),
  addBtn = document.getElementById("calculator-add"),
  removeBtn = document.getElementById("calculator-remove"),
  distanceColumn = document.querySelector(".calculator__row-distance"),
  chargesSelect = document.getElementById("charges-select"),
  btnCalc = document.querySelector(".calculator__btn-calc"),
  chargeUnits = ["C", "μC", "nC", "mC"],
  distanceUnits = ["m", "cm", "mm", "km"],
  valores = {
    C: 1,
    μC: 1 * Math.pow(10, -6),
    nC: 1 * Math.pow(10, -9),
    mC: 1 * Math.pow(10, -3),
    m: 1,
    cm: 1/100,
    mm: 1/1000,
    km: 1000
  };

let idCharge = 0,
  idRow = 1,
  idDistance = 1,
  selectedChargeValue = chargesSelect.value;

window.addEventListener("load", () => {
  updateChargeSelect();
  createColumn();
  createColumn();
  verify();
});

addBtn.addEventListener("click", () => {
  createColumn();
  verify();
  let span = document.querySelector(".res");
  span.textContent = "0 N";

});

removeBtn.addEventListener("click", () => {
  deleteColumn();
  verify();
  createDistance(selectedChargeValue);
  let span = document.querySelector(".res");
  span.textContent = "0 N";
});

chargesSelect.addEventListener("change", () => {
  updateChargeSelect();
  createDistance(selectedChargeValue);
});

btnCalc.addEventListener("click", () => {
  calcular();
});

const calcular = () => {
  const cargaSeleccionada = selectedChargeValue,
    chargesDiv = document.querySelectorAll(".calculator__charge"),
    distancesDiv = document.querySelectorAll(".calculator__distance");

  let data = [],
    distances = [],
    fuerza = 0;

  chargesDiv.forEach((charge) => {
    let obj = {
      [charge.children[0].name]: charge.children[0].value,
      [charge.children[1].name]: charge.children[1].value,
    };
    data.push(obj);
  });

  distancesDiv.forEach((distance) => {
    let obj = {
      [distance.children[1].name]: distance.children[1].value,
      [distance.children[2].name]: distance.children[2].value,
    };
    distances.push(obj);
  });
  console.log(data);
  console.log(distances);

  distances.splice(cargaSeleccionada - 1, 0, {});
  console.log(distances);

  for (let i = 0; i < distances.length; i++) {
    let carga1 = data[cargaSeleccionada - 1],
      carga2 = data[i],
      distance = distances[i];
    fuerza += leyCoulomb(carga1, carga2, distance, i, cargaSeleccionada);
    console.log("Acumulado: " + fuerza);
  }

  console.log("Fuerza Total: " + fuerza);
  mostrarRespuesta(fuerza);
};
const mostrarRespuesta = (num) => {
  // let res = Number(number.toFixed(3)),
  // res2 = res.toExponential(),
  let span = document.querySelector(".res");
  // span.textContent = res2 + ' N';
  // console.log(res2);

  // Convertir a notación científica si la parte entera tiene más de 4 dígitos
  if (Math.abs(num) >= 10000) {
    num = num.toExponential(3);
    // Limitar el número total de dígitos a 6
    num = parseFloat(num);
    if (Math.abs(num) >= 1e6) {
        num = Math.round(num / Math.pow(10, Math.floor(Math.log10(Math.abs(num))) - 2)) * Math.pow(10, Math.floor(Math.log10(Math.abs(num))) - 2);
    }
  span.textContent = num.toExponential(3) + " N";
} else {
    // Redondear a tres decimales si la parte entera tiene 4 dígitos o menos
span.textContent =  num.toFixed(3) + " N";
}
}
const leyCoulomb = (carga1, carga2, distance, i, chargeIndex) => {
  if (carga1 === carga2) return 0;
  // let carga1 = eval(carga1.value) * eval(valores[carga1.unit]);
  // let carga2 = eval(carga2.value) * eval(valores[carga2.unit]);
  // let distance = eval(distance.value) * eval(valores[distance.unit]);
  let force =
    (8.99 *
      Math.pow(10, 9) *
      Math.abs(eval(carga1.value) * valores[carga1.unit] * eval(carga2.value) * valores[carga2.unit])) /
    Math.pow(eval(distance.value) * valores[distance.unit], 2);
  if (eval(carga1.value) > 0) {
    console.log("Carga principal mayor a 0");
    if (
      (i < chargeIndex - 1 && eval(carga2.value) < 0) ||
      (i > chargeIndex - 1 && eval(carga2.value) > 0)
    ) {
      console.log("Apunta a la izquierda (Fuerza negativa)");
      force = force * -1;
    }
  } else {
    console.log("Carga principal menor a 0");
    if (
      (i < chargeIndex - 1 && eval(carga2.value) > 0) ||
      (i > chargeIndex - 1 && eval(carga2.value) < 0)
    ) {
      console.log("Apunta a la izquierda (Fuerza negativa)");
      force = force * -1;
    }
  }
  console.log("Signo fuerza: " + force);
  return force;
};

const updateChargeSelect = () => {
  selectedChargeValue = chargesSelect.value;
};

const createColumn = (distance = false) => {
  idCharge++;
  // Crear la Columna
  let lastRow = table.lastChild.children[table.lastChild.children.length - 2];
  let rows = table.lastChild.getElementsByTagName("tr");

  const td = document.createElement("TD"),
    div = document.createElement("DIV"),
    input = document.createElement("INPUT"),
    select = document.createElement("SELECT");

  td.classList.add("calculator__column", `calculator__charge-${idCharge}`);
  td.textContent = `Carga ${idCharge}`;
  div.classList.add("calculator__charge", `charge-${idCharge}`);
  input.type = "text";
  input.name = "value";
  input.classList.add("calculator__input-charge", `input__charge-${idCharge}`);
  select.classList.add(
    "calculator__select-charge-1",
    `select__charge-${idCharge}`
  );
  select.name = "unit";
  chargeUnits.forEach((unit) => {
    let option = document.createElement("OPTION");
    option.value = unit;
    option.textContent = unit;
    select.appendChild(option);
  });

  div.appendChild(input);
  div.appendChild(select);
  td.appendChild(div);

  // Saber cuantas columnas ahi y pasar a otra fila
  if (lastRow.childElementCount === 3) {
    let tr = document.createElement("TR");
    tr.classList.add("calculator__row");
    idRow++;
    tr.setAttribute("id", `row-${idRow}`);
    tr.appendChild(td);
    console.log("Fila agregada: " + idRow);
    table.lastChild.insertBefore(tr, rows[rows.length - 1]);
  } else {
    lastRow.appendChild(td);
  }

  // Modificar select de cargas
  if (idCharge > 2) {
    let option = document.createElement("OPTION");
    option.value = `${idCharge}`;
    option.innerText = idCharge;
    chargesSelect.appendChild(option);
  }

  if (!distance) createDistance(selectedChargeValue);
};

const deleteColumn = () => {
  let lastRow = table.lastChild.children[table.lastChild.children.length - 2];
  lastRow.removeChild(lastRow.lastChild);
  if (lastRow.children.length === 0) {
    idRow--;
    console.log("Fila eliminada: " + idRow);
    table.lastChild.removeChild(lastRow);
    lastRow = table.lastChild.children[table.lastChild.children.length - 2];
  }
  chargesSelect.removeChild(
    chargesSelect.children[chargesSelect.children.length - 1]
  );
  idCharge--;
  createDistance(selectedChargeValue);
};

const verify = () => {
  let childrenCount = table.lastChild.children;
  let columnsCount = childrenCount[1].children.length;

  if (columnsCount == 2) {
    removeBtn.setAttribute("disabled", "true");
    removeBtn.classList.add("button__disabled");
    return true;
  } else {
    removeBtn.removeAttribute("disabled");
    removeBtn.classList.remove("button__disabled");
    return false;
  }
};

const createDistance = (chargeSelected) => {
  distanceColumn.textContent = "";
  idDistance = 1;
  if (idCharge == 2) {
    let i = 1;
    if (chargeSelected == 1) i = 2;
    createDistance2(chargeSelected, i);
  } else {
    for (let i = 1; i <= idCharge; i++) {
      createDistance2(chargeSelected, i);
    }
  }
};

const createDistance2 = (chargeSelected, i) => {
  if (chargeSelected != i) {
    let div = document.createElement("DIV"),
      p = document.createElement("P"),
      input = document.createElement("INPUT"),
      select = document.createElement("SELECT");

    div.classList.add("calculator__distance");
    p.textContent = `Distancia Q${chargeSelected} - Q${i}: `;
    input.type = "text";
    input.name = "value";
    input.classList.add("calculator__input-charge", "input__distance");
    input.setAttribute("id", `distance-${chargeSelected}-${i}`);
    select.classList.add("calculator__select-charge-1");
    select.name = "unit";

    distanceUnits.forEach((unit) => {
      let option = document.createElement("OPTION");
      option.value = unit;
      option.textContent = unit;
      select.appendChild(option);
    });

    div.appendChild(p);
    div.appendChild(input);
    div.appendChild(select);

    distanceColumn.appendChild(div);
    idDistance++;
  }
};
const deleteDistance = () => {
  let lastDiv = distanceColumn.children[distanceColumn.children.length - 1];
  distanceColumn.removeChild(lastDiv);
  idDistance--;
};