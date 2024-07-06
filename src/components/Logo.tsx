import React from "react";
import { useTranslation } from "next-i18next";

export const Logo: React.FC<{
  className: string
}> = ({
  className
}) => {
  const {t} = useTranslation('common')

  return (
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" version="1.1" className={className}>
      <g id="logo">
        <ellipse ry="16.8044" rx="16.8044" id="svg_4" cy="44.39854" cx="140" fill="none"/>
        <ellipse ry="13.75658" rx="13.75658" id="svg_5" cy="110.31884" cx="183.98406" fill="none"/>
        <ellipse ry="18.30806" rx="18.30806" id="svg_6" cy="179.59169" cx="129.1254" fill="none"/>
        <ellipse ry="24.02197" rx="24.02197" id="svg_7" cy="165.29301" cx="344.58917" fill="none"/>
        <ellipse ry="12.89487" rx="12.89487" id="svg_8" cy="111.32338" cx="415.91021" fill="none"/>
        <ellipse ry="13.79707" rx="13.79707" id="svg_9" cy="162.28568" cx="469.00136" fill="none"/>
        <ellipse ry="21.01465" rx="21.01465" id="svg_10" cy="272.95524" cx="235.03148" fill="none"/>
        <ellipse ry="18.90953" rx="18.90953" id="svg_11" cy="240.77686" cx="416.97464" fill="none"/>
        <ellipse ry="13.49634" rx="13.49634" id="svg_12" cy="314.75706" cx="376.67648" fill="none"/>
        <ellipse ry="14.69927" rx="14.69927" id="svg_13" cy="410.39" cx="316.52998" fill="none"/>
        <ellipse ry="11.99267" rx="11.99267" id="svg_14" cy="286.5274" cx="317.01667" fill="none"/>
        <ellipse ry="14.0978" rx="14.0978" id="svg_15" cy="327.38783" cx="139.0978" fill="none"/>
        <ellipse ry="12.89487" rx="12.89487" id="svg_16" cy="260.56875" cx="78.84104" fill="none"/>
        <ellipse ry="15.60147" rx="15.60147" id="svg_17" cy="411.2922" cx="79.25204" fill="none"/>
        <ellipse ry="11.69194" rx="11.69194" id="svg_18" cy="367.08453" cx="247.3615" fill="none"/>
        <ellipse ry="12.89487" rx="12.89487" id="svg_19" cy="344.83031" cx="29.0297" fill="none"/>
        <ellipse ry="12.89487" rx="12.89487" id="svg_20" cy="455.49988" cx="349.61056" fill="none"/>
        <line id="svg_21" y2="102.37682" x2="176.98501" y1="59.52018" x1="149.20755" fill="none"/>
        <line id="svg_22" y2="111.10688" x2="76.18917" y1="111.10688" x1="169.84223" fill="none"/>
        <line id="svg_25" y2="249.2005" x2="78.57346" y1="111.10688" x1="78.57346" fill="none"/>
        <line id="svg_26" y2="394.44799" x2="79.16667" y1="273.61111" x1="79.16667" fill="none"/>
        <line id="svg_27" y2="398.61111" x2="69.90741" y1="356.94444" x1="37.96296" fill="none"/>
        <line id="svg_28" y2="164.35185" x2="141.2037" y1="121.75926" x1="175" fill="none"/>
        <line id="svg_29" y2="248.61111" x2="85.64815" y1="193.98148" x1="118.51852" fill="none"/>
        <line id="svg_30" y2="182.40741" x2="327.77778" y1="258.7963" x1="252.31481" fill="none"/>
        <line id="svg_31" y2="150.92593" x2="364.35185" y1="118.98148" x1="406.01852" fill="none"/>
        <ellipse ry="7.36304" rx="7.36304" id="svg_33" cy="192.08296" cx="247.10926" fill="none"/>
        <line id="svg_35" y2="187.03704" x2="242.59259" y1="122.22222" x1="192.12963" fill="none"/>
        <line id="svg_36" y2="109.72222" x2="312.5" y1="187.03704" x1="250.92593" fill="none"/>
        <line id="svg_37" y2="112.03704" x2="404.62963" y1="111.11111" x1="310.18519" fill="none"/>
        <line id="svg_38" y2="251.38889" x2="238.42593" y1="199.07407" x1="245.83333" fill="none"/>
        <line id="svg_39" y2="259.25926" x2="219.90741" y1="193.05556" x1="143.98148" fill="none"/>
        <line id="svg_40" y2="313.88889" x2="137.96296" y1="200" x1="128.24074" fill="none"/>
        <line id="svg_41" y2="284.25926" x2="177.31481" y1="316.2037" x1="147.68519" fill="none"/>
        <line id="svg_42" y2="318.05556" x2="131.01852" y1="272.22222" x1="88.88889" fill="none"/>
        <line id="svg_43" y2="410.64815" x2="176.85185" y1="342.59259" x1="143.51852" fill="none"/>
        <line id="svg_44" y2="412.03703" x2="177.77776" y1="282.4074" x1="177.77781" fill="none"/>
        <line id="svg_45" y2="410.18519" x2="180.1041" y1="410.18519" x1="96.2963" fill="none"/>
        <line id="svg_46" y2="358.7963" x2="241.2037" y1="284.25926" x1="178.7037" fill="none"/>
        <line id="svg_49" y2="357.87037" x2="253.7037" y1="294.90741" x1="307.87037" fill="none"/>
        <line id="svg_50" y2="396.75926" x2="316.66667" y1="299.07407" x1="316.66667" fill="none"/>
        <line id="svg_51" y2="444.44444" x2="342.59259" y1="422.22222" x1="325.92593" fill="none"/>
        <line id="svg_52" y2="396.75926" x2="324.53704" y1="327.31481" x1="369.44444" fill="none"/>
        <line id="svg_53" y2="303.24074" x2="382.87037" y1="256.48148" x1="406.94444" fill="none"/>
        <line id="svg_54" y2="228.7037" x2="405.09259" y1="183.33333" x1="360.64815" fill="none"/>
        <line id="svg_55" y2="153.7037" x2="460.18519" y1="119.44444" x1="425.46296" fill="none"/>
        <line id="svg_57" y2="301.85185" x2="373.61111" y1="189.35185" x1="350.46296" fill="none"/>
        <line id="svg_59" y2="341.66667" x2="130.09259" y1="398.14815" x1="88.42593" fill="none"/>
        <line id="svg_60" y2="413.96193" x2="415.74074" y1="260.25753" x1="415.74074" fill="none"/>
        <line id="svg_61" y2="411.57407" x2="416.69828" y1="411.57407" x1="331.94444" fill="none"/>
        <line id="svg_62" y2="221.44078" x2="415.81633" y1="125.5102" x1="415.81633" fill="none"/>
        <line id="svg_63" y2="284.45292" x2="178.63745" y1="196.67375" x1="138.69161" fill="none"/>
        <line id="svg_64" y2="284.71823" x2="306.94402" y1="272.91277" x1="257.63883" fill="none"/>
        <line id="svg_65" y2="355.16104" x2="245.96769" y1="294.24264" x1="237.34716" fill="none"/>
      </g>
      </svg>
  )
}