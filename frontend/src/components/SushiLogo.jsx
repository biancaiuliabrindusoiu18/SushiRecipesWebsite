export function SushiLogo() {
    return (
      <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Red circle background */}
        <path
          d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z"
          fill="#E85A4F"
        />
        <path
          d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z"
          fill="#E85A4F"
        />
  
        {/* Rough edges of the circle */}
        <path
          d="M30 85C25 82 22 90 20 95M40 40C35 35 25 30 20 35M160 40C165 30 175 35 180 40M180 120C185 125 182 140 175 150M50 175C40 180 25 175 20 165M150 175C160 180 175 170 180 160"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
        />
  
        {/* Sushi roll */}
        <rect x="75" y="85" width="50" height="40" rx="5" fill="#000000" />
  
        {/* White center of sushi */}
        <circle cx="100" cy="105" r="10" fill="#FFFFFF" />
        <circle cx="100" cy="105" r="5" fill="#E85A4F" />
  
        {/* Chopsticks */}
        <line x1="60" y1="70" x2="120" y2="130" stroke="#000000" strokeWidth="8" strokeLinecap="round" />
        <line x1="140" y1="70" x2="80" y2="130" stroke="#000000" strokeWidth="8" strokeLinecap="round" />
  
        {/* White outline for chopsticks */}
        <line x1="60" y1="70" x2="120" y2="130" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <line x1="140" y1="70" x2="80" y2="130" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  