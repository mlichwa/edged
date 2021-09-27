var language;
const enTranslation = " fleet charging, 50% utilization vs. equivalent diesel miles traveled";
const esTranslation1 = "Carga de la flota de ";
const esTranslation2 = ", utilización del 50% frente a los kilómetros recorridos en diésel equivalentes";
const ptTranslation = " de carga da frota, 50% de utilização em relação às milhas diesel equivalentes percorridas";

$(document).ready(function() {
 
  const allRanges = document.querySelectorAll(".range-wrap");
  allRanges.forEach(wrap => {
    const range = wrap.querySelector(".range");
    const bubble = wrap.querySelector(".bubble");
  
    range.addEventListener("input", () => {  
      setBubble(range, bubble);
      
    });
    setBubble(range, bubble);
  });
  
  function setBubble(range, bubble) {

    const normalizedValue = this.sliderValues[range.value];
    const val = range.value;
    const min = 0;
    const max = 16;
    const newVal = Number(((val - min) * 100) / (max - min));
   
   
    var result =  normalizedValue + "<span class='bubble_sub'>MW<span>";
    if(Weglot.getCurrentLang() == 'es' || Weglot.getCurrentLang() == 'pt'){
        result = result.replace(".", ",");
    }
    
    bubble.innerHTML = result;
  
    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${16 - newVal * 0.15}px))`;
  
    var carbonSavings = document.getElementById("carbonSavings");
    var waterSavings = document.getElementById("waterSavings");
    var evCarbonSavings = document.getElementById("evCarbonSavings");
    var textFleetCharging = document.getElementById("textFleetCharging");
    var carbonIntensity = document.getElementById("carbon-intensity");
    const grid_carbon_intensity_Spain_kgCO2_MWh =	207;
    site_size_MW = normalizedValue;
      
    if(Weglot.getCurrentLang() == 'es'){
        var res2 =  normalizedValue + "MW";
        res2 = res2.replace(".", ",");
        textFleetCharging.innerHTML = esTranslation1 + res2 + esTranslation2;
    }
      
    if(Weglot.getCurrentLang() == 'pt'){
        var res2 =  normalizedValue + "MW";
        res2 = res2.replace(".", ",");
        textFleetCharging.innerHTML = res2 + ptTranslation;
    }

    if(Weglot.getCurrentLang() == 'en'){
        var res2 =  normalizedValue + "MW";
        textFleetCharging.innerHTML = res2 + enTranslation;
        console.log(textFleetCharging.innerHTML);
    }
      
    // ------------------ Data Center ------------------ 
    const avg_PUE_europe = 1.46;
    let power_used_MW = site_size_MW * avg_PUE_europe;
    let annual_used_power_MWh_yr = power_used_MW * 365.25 * 24;
    let est_datacenter_CO2_saved_kgCO2_yr = annual_used_power_MWh_yr * carbonIntensity.value;
      
    var unformatted1 = numeral(est_datacenter_CO2_saved_kgCO2_yr).format('0.0a');
    if(Weglot.getCurrentLang() == 'pt'){
        unformatted1 = unformatted1.replace(".", ",");
        unformatted1 = unformatted1.replace("K", " mil");
        unformatted1 = unformatted1.replace("M", " milhões");
        unformatted1 = unformatted1.replace("B", " mil milhões");
    }

    if( Weglot.getCurrentLang() == 'es'){
        unformatted1 = unformatted1.replace(".", ",");
        unformatted1 = unformatted1.replace("K", " mil");
        unformatted1 = unformatted1.replace("M", " millón");
        unformatted1 = unformatted1.replace("B", " mil millones");
    }

    var formatted1 = unformatted1.replace(/(m|b)/g, '<span class="m_caps">$1</span>');
    carbonSavings.innerHTML =  formatted1;
      
    // ------------------ Water ------------------
  
    const avg_WUE_liters_kWh = 1.8;
    const olympic_swimming_pool_liters = 2500000;
    let water_saved_liters_yr = annual_used_power_MWh_yr * avg_WUE_liters_kWh * 1000;
      
    //console.log(water_saved_liters_yr);
    var unformatted2 = numeral(water_saved_liters_yr).format('0.0a');

    if(Weglot.getCurrentLang() == 'pt'){
        unformatted2 = unformatted2.replace(".", ",");
        unformatted2 = unformatted2.replace("K", " mil");
        unformatted2 = unformatted2.replace("M", " milhões");
        unformatted2 = unformatted2.replace("B", " mil milhões");
    }

    if( Weglot.getCurrentLang() == 'es'){
        unformatted2 = unformatted2.replace(".", ",");
        unformatted2 = unformatted2.replace("K", " mil");
        unformatted2 = unformatted2.replace("M", " millón");
        unformatted2 = unformatted2.replace("B", " mil millones");
    }


    var formatted2 = unformatted2.replace(/(m|b)/g, '<span class="m_caps">$1</span>');
    waterSavings.innerHTML = formatted2;
      
      
    let pools_yr = 921;
    let pools_day = 2.52;
      
      
	// ------------------ EV Charging ---------------------

	const EV_utilization_rate	= 0.3;
	const gasoline_carbon_intensity_kgCO2_gallon =	8.887;
	const diesel_carbon_intensity_kgCO2_gallon = 10.18;
	const avg_EV_car_efficiency_kwh_mile =	0.3;
	const avg_ICE_car_efficiency_mpg = 24.2;
	const avg_EV_truck_efficiency_kwh_mile =	1.44;
	const avg_ICE_truck_efficiency_mpg	= 6.498;

	let max_annual_power_output_MWh = site_size_MW * 24 * 365.25;
	let annual_used_power_output_MWh = max_annual_power_output_MWh * EV_utilization_rate;
	let miles_charged = annual_used_power_output_MWh * 1000 / avg_EV_truck_efficiency_kwh_mile;
	let ICE_fuel_equivalent_gallons = miles_charged / avg_ICE_truck_efficiency_mpg;
	let est_vehicle_CO2_saved_kgCO2 = ICE_fuel_equivalent_gallons * diesel_carbon_intensity_kgCO2_gallon;
	//console.log(est_vehicle_CO2_saved_kgCO2);
	var unformatted3 = numeral(est_vehicle_CO2_saved_kgCO2).format('0.0a');

	if(Weglot.getCurrentLang() == 'pt'){
		unformatted3 = unformatted3.replace(".", ",");
		unformatted3 = unformatted3.replace("K", " mil");
		unformatted3 = unformatted3.replace("M", " milhões");
		unformatted3 = unformatted3.replace("B", " mil milhões");
	}

	if( Weglot.getCurrentLang() == 'es'){
	  unformatted3 = unformatted3.replace(".", ",");
	  unformatted3 = unformatted3.replace("K", " mil");
	  unformatted3 = unformatted3.replace("M", " millón");
	  unformatted3 = unformatted3.replace("B", " mil millones");
	}

	var formatted3 = unformatted3.replace(/(m|b)/g, '<span class="m_caps">$1</span>');
	evCarbonSavings.innerHTML = formatted3;
  }
  
  document.querySelectorAll(".range").forEach(function(el) {       
    el.oninput =function(){            
    var valPercent = (el.valueAsNumber  - parseInt(el.min)) / 
                        (parseInt(el.max) - parseInt(el.min));
      var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop('+ valPercent+', #03b1da), color-stop('+ valPercent+', #f5f6f8));';
      el.style = style;
    };
    el.oninput();
  });
});

