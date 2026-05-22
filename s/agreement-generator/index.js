
let currentAgreement = 'rent';
let currentLanguage = 'english';
let currentStampValue = null;
let customStampData = null;
let currentFontSize = 11;

// Real Stamp Paper Images
const stampImages = {
    '10': 'https://smartcsctools.com/image/10-stamp.png',
    '20': 'https://smartcsctools.com/image/20-stamp.png',
    '50': 'https://smartcsctools.com/image/50-stamp.png',
    '100': 'https://smartcsctools.com/image/100-stamp.png'
};

// Complete Agreement Templates in English
const agreementBodiesEn = {
    rent: `THIS RESIDENTIAL HOUSE RENT AGREEMENT is made and executed on this {date} at {place}.

BETWEEN

1. {ownerName}, son of {firstPartyFather}, resident of {firstPartyAddress} (hereinafter referred to as the "LANDLORD/OWNER") of the FIRST PART.

AND

2. {tenantName}, son of {secondPartyFather}, resident of {secondPartyAddress} (hereinafter referred to as the "TENANT") of the SECOND PART.

WHEREAS the Owner is the absolute owner of the property situated at {propertyAddress}.

NOW THIS AGREEMENT WITNESSETH AS UNDER:

1. The Owner hereby gives on rent the said property to the Tenant for residential purposes only for a period of {rentPeriod} months.

2. The monthly rent for the said property shall be ₹{monthlyRent} (Rupees {monthlyRentWords} only) per month.

3. The Tenant shall pay a security deposit of ₹{depositAmount} (Rupees {depositAmountWords} only) to the Owner, which is refundable at the time of vacating the property subject to no damages.

4. The rent agreement shall be valid for a period of {rentPeriod} months from {startDate}.

5. The rent shall be paid on or before the 7th day of every English calendar month.

6. The Tenant shall not sublet the premises or any part thereof to any other person.

7. The Tenant shall pay electricity and water charges as per actual bills.

8. The Tenant shall maintain the property in good condition and shall not make any structural changes.

9. Either party may terminate this agreement by giving one month's written notice.

{specialTerms}`,

    bayana: `THIS LAND SALE ADVANCE (BAYANA) AGREEMENT is made and executed on this {date} at {place}.

BETWEEN

1. {sellerName}, son of {firstPartyFather}, resident of {firstPartyAddress} (hereinafter called the "SELLER/VENDOR") of the FIRST PART.

AND

2. {buyerName}, son of {secondPartyFather}, resident of {secondPartyAddress} (hereinafter called the "BUYER/VENDEE") of the SECOND PART.

WHEREAS the Seller is the absolute owner of the land/property situated at {landAddress}.

WHEREAS the Buyer has agreed to purchase the said property for a total consideration of ₹{totalAmount} (Rupees {totalAmountWords} only).

NOW THIS AGREEMENT WITNESSETH AS UNDER:

1. The Buyer has paid an advance amount of ₹{advanceAmount} (Rupees {advanceAmountWords} only) as Bayana to the Seller today.

2. The remaining amount of ₹{remainingAmount} (Rupees {remainingAmountWords} only) shall be paid at the time of registration of sale deed.

3. The sale transaction shall be completed within {saleDeadline} days from the date of this agreement.

4. If the Buyer fails to complete the sale within the stipulated time, the Bayana amount shall be forfeited.

5. If the Seller fails to complete the sale, he shall refund double the Bayana amount to the Buyer.

6. The Seller shall provide all necessary documents including clear title deed, no dues certificate, etc.

7. All expenses for registration and stamp duty shall be borne by the Buyer.

{specialTerms}`,

    shop_lease: `THIS COMMERCIAL SHOP LEASE AGREEMENT is made and executed on this {date} at {place}.

BETWEEN

1. {lessorName}, son of {firstPartyFather}, resident of {firstPartyAddress} (hereinafter called the "LESSOR") of the FIRST PART.

AND

2. {lesseeName}, son of {secondPartyFather}, resident of {secondPartyAddress} (hereinafter called the "LESSEE") of the SECOND PART.

WHEREAS the Lessor is the owner of the commercial shop situated at {shopAddress}.

NOW THIS LEASE AGREEMENT WITNESSETH AS UNDER:

1. The Lessor hereby leases the said shop to the Lessee for commercial purposes for a period of {leasePeriod} years.

2. The monthly rent shall be ₹{monthlyRent} (Rupees {monthlyRentWords} only).

3. The rent shall be increased by {rentIncrease}% every year on the anniversary date.

4. The Lessee shall pay a security deposit equivalent to 3 months' rent.

5. The Lessee shall bear the cost of electricity, water, and maintenance charges.

6. The Lessee shall not use the premises for any illegal or prohibited activities.

7. The Lessee shall not sublet the shop without written consent of the Lessor.

{specialTerms}`,

    vehicle_sale: `THIS VEHICLE SALE & TRANSFER AGREEMENT is made and executed on this {date} at {place}.

BETWEEN

1. {sellerName}, son of {firstPartyFather}, resident of {firstPartyAddress} (hereinafter called the "SELLER") of the FIRST PART.

AND

2. {buyerName}, son of {secondPartyFather}, resident of {secondPartyAddress} (hereinafter called the "BUYER") of the SECOND PART.

WHEREAS the Seller is the registered owner of the vehicle described as under:
{vehicleDetails}

AND WHEREAS the Buyer has agreed to purchase the said vehicle for a total consideration of ₹{salePrice} (Rupees {salePriceWords} only).

NOW THIS AGREEMENT WITNESSETH AS UNDER:

1. The Seller hereby sells and transfers the said vehicle to the Buyer with immediate effect.

2. The Buyer has paid the full sale consideration amount today.

3. The Seller hands over the original RC book, insurance papers, pollution certificate, and all other relevant documents.

4. The Seller shall assist the Buyer in transferring the vehicle registration at the RTO within 30 days.

5. All taxes, fines, or liabilities from the date of transfer shall be borne by the Buyer.

6. The vehicle is sold in "as is where is" condition with no warranty from the Seller.

{specialTerms}`,

    partnership: `THIS BUSINESS PARTNERSHIP AGREEMENT is made and executed on this {date} at {place}.

BETWEEN

1. {partner1Name}, son of {firstPartyFather}, resident of {firstPartyAddress} (hereinafter called the "FIRST PARTNER").

AND

2. {partner2Name}, son of {secondPartyFather}, resident of {secondPartyAddress} (hereinafter called the "SECOND PARTNER").

WHEREAS the partners have agreed to carry on business in partnership under the name and style of {businessName}.

NOW THIS PARTNERSHIP DEED WITNESSETH AS UNDER:

1. The name of the partnership firm shall be {businessName}.

2. The business shall be carried on from {businessAddress}.

3. The partners shall contribute capital as per their agreed amounts. Total capital contribution: ₹{capitalContribution}.

4. The profits and losses shall be shared in the ratio of {profitRatio}.

5. Each partner shall have equal rights in the management of the business.

6. No partner shall without the consent of other partners:
   a) Sell or mortgage firm property
   b) Admit new partners
   c) Engage in competing business

7. The partnership shall continue until dissolved by mutual consent.

{specialTerms}`,

    event: `THIS EVENT MANAGEMENT SERVICE AGREEMENT is made and executed on this {date} at {place}.

BETWEEN

1. {clientName}, son of {firstPartyFather}, resident of {firstPartyAddress} (hereinafter called the "CLIENT") of the FIRST PART.

AND

2. {eventManager}, son of {secondPartyFather}, resident of {secondPartyAddress} (hereinafter called the "SERVICE PROVIDER") of the SECOND PART.

WHEREAS the Client desires to organize {eventType} on {eventDate} at {eventVenue}.

AND WHEREAS the Service Provider has agreed to provide event management services.

NOW THIS AGREEMENT WITNESSETH AS UNDER:

1. The Service Provider shall provide complete event management services including venue decoration, catering, entertainment, and coordination.

2. The total cost for the services shall be ₹{totalCost} (Rupees {totalCostWords} only).

3. The Client has paid an advance of ₹{advanceAmount} (Rupees {advanceAmountWords} only).

4. The remaining amount shall be paid 7 days before the event date.

5. The Service Provider shall provide a detailed itinerary and checklist 15 days before the event.

6. Cancellation charges: 50% of advance if cancelled within 30 days, 100% if cancelled within 15 days.

{specialTerms}`,

    mortgage: `THIS PROPERTY MORTGAGE/PLEDGE AGREEMENT is made and executed on this {date} at {place}.

BETWEEN

1. {mortgagorName}, son of {firstPartyFather}, resident of {firstPartyAddress} (hereinafter called the "MORTGAGOR") of the FIRST PART.

AND

2. {mortgageeName}, son of {secondPartyFather}, resident of {secondPartyAddress} (hereinafter called the "MORTGAGEE") of the SECOND PART.

WHEREAS the Mortgagor has borrowed a sum of ₹{loanAmount} (Rupees {loanAmountWords} only) from the Mortgagee.

AND WHEREAS the Mortgagor has agreed to mortgage his property as security for the said loan.

NOW THIS AGREEMENT WITNESSETH AS UNDER:

1. The Mortgagor hereby mortgages the property situated at {propertyAddress} to the Mortgagee.

2. The loan amount of ₹{loanAmount} shall carry interest at {interestRate}% per annum.

3. The Mortgagor shall repay the loan with interest in monthly installments over {repaymentPeriod} months.

4. In case of default, the Mortgagee shall have the right to sell the mortgaged property.

5. The Mortgagor shall not sell or transfer the property until full repayment.

6. Upon full repayment, the Mortgagee shall release the mortgage and return all documents.

{specialTerms}`,

    goods: `THIS GOODS SUPPLY AGREEMENT is made and executed on this {date} at {place}.

BETWEEN

1. {supplierName}, son of {firstPartyFather}, resident of {firstPartyAddress} (hereinafter called the "SUPPLIER") of the FIRST PART.

AND

2. {buyerName}, son of {secondPartyFather}, resident of {secondPartyAddress} (hereinafter called the "BUYER") of the SECOND PART.

WHEREAS the Buyer has agreed to purchase goods from the Supplier as per the terms below.

NOW THIS AGREEMENT WITNESSETH AS UNDER:

1. The Supplier shall supply {goodsDesc} of total quantity {quantity} units.

2. The unit price of the goods shall be ₹{unitPrice} per unit. Total value: ₹{totalValue} (Rupees {totalValueWords} only).

3. The goods shall be delivered as per the schedule: {deliverySchedule}.

4. Payment terms: 30% advance, 70% against delivery.

5. The Supplier warrants that the goods shall be of merchantable quality.

6. Any dispute shall be resolved through arbitration.

{specialTerms}`,

    loan: `THIS FINANCIAL LOAN/DEBT AGREEMENT is made and executed on this {date} at {place}.

BETWEEN

1. {lenderName}, son of {firstPartyFather}, resident of {firstPartyAddress} (hereinafter called the "LENDER") of the FIRST PART.

AND

2. {borrowerName}, son of {secondPartyFather}, resident of {secondPartyAddress} (hereinafter called the "BORROWER") of the SECOND PART.

WHEREAS the Borrower has requested and the Lender has agreed to give a loan of ₹{loanAmount} (Rupees {loanAmountWords} only).

NOW THIS AGREEMENT WITNESSETH AS UNDER:

1. The Lender hereby gives a loan of ₹{loanAmount} to the Borrower.

2. The loan shall carry interest at {interestRate}% per annum.

3. The Borrower shall repay the loan in {tenure} monthly installments of ₹{emiAmount} each.

4. The first installment shall be due on [Date] and subsequent installments on the same date each month.

5. In case of default, the Lender shall charge a penalty of 2% per month on the overdue amount.

6. The Borrower may prepay the loan without any penalty after 6 months.

{specialTerms}`,

    vehicle_rent: `THIS VEHICLE HIRE/RENTAL AGREEMENT is made and executed on this {date} at {place}.

BETWEEN

1. {ownerName}, son of {firstPartyFather}, resident of {firstPartyAddress} (hereinafter called the "OWNER") of the FIRST PART.

AND

2. {hirerName}, son of {secondPartyFather}, resident of {secondPartyAddress} (hereinafter called the "HIRER") of the SECOND PART.

WHEREAS the Owner is the registered owner of the vehicle described below:
{vehicleDetails}

NOW THIS AGREEMENT WITNESSETH AS UNDER:

1. The Owner hereby gives the said vehicle on hire to the Hirer.

2. The rental charges shall be ₹{rentalAmount} for {rentalPeriod}.

3. The Hirer has paid a security deposit of ₹{securityDeposit} (Rupees {securityDepositWords} only).

4. The Hirer shall bear the cost of fuel, toll, parking, and driver's allowance.

5. The vehicle shall be used only for lawful purposes and not for any illegal activity.

6. Any damage to the vehicle shall be borne by the Hirer.

7. The security deposit shall be refunded after deducting any dues or damages.

{specialTerms}`
};

// Complete Agreement Templates in Hindi
const agreementBodiesHi = {
    rent: `यह आवासीय किराया समझौता {date} को {place} में किया गया है।

के बीच

1. {ownerName}, पुत्र {firstPartyFather}, निवासी {firstPartyAddress} (जिन्हें "मकान मालिक" कहा जाएगा) प्रथम पक्ष।

और

2. {tenantName}, पुत्र {secondPartyFather}, निवासी {secondPartyAddress} (जिन्हें "किरायेदार" कहा जाएगा) द्वितीय पक्ष।

जहां मकान मालिक {propertyAddress} पर स्थित संपत्ति के पूर्ण मालिक हैं।

अब यह समझौता निम्नलिखित शर्तों पर हुआ है:

1. मकान मालिक किरायेदार को आवासीय उद्देश्यों के लिए {rentPeriod} महीने की अवधि के लिए संपत्ति किराए पर देता है।

2. मासिक किराया ₹{monthlyRent} (रुपये {monthlyRentWords} मात्र) प्रति माह होगा।

3. किरायेदार ₹{depositAmount} (रुपये {depositAmountWords} मात्र) सुरक्षा जमा राशि मकान मालिक को देगा।

4. किराया प्रत्येक अंग्रेजी कैलेंडर माह की 7 तारीख को या उससे पहले देय होगा।

5. किरायेदार बिना अनुमति के संपत्ति का उप-किराया नहीं कर सकता।

6. बिजली और पानी के बिल किरायेदार वहन करेगा।

{specialTerms}`,

    bayana: `यह भूमि विक्रय अग्रिम (बयाना) समझौता {date} को {place} में किया गया है।

के बीच

1. {sellerName}, पुत्र {firstPartyFather}, निवासी {firstPartyAddress} (जिन्हें "विक्रेता" कहा जाएगा) प्रथम पक्ष।

और

2. {buyerName}, पुत्र {secondPartyFather}, निवासी {secondPartyAddress} (जिन्हें "क्रेता" कहा जाएगा) द्वितीय पक्ष।

जहां विक्रेता {landAddress} पर स्थित भूमि/संपत्ति के पूर्ण मालिक हैं।

अब यह समझौता निम्नलिखित शर्तों पर हुआ है:

1. क्रेता ने आज विक्रेता को ₹{advanceAmount} (रुपये {advanceAmountWords} मात्र) बयाना राशि का भुगतान किया है।

2. शेष राशि ₹{remainingAmount} (रुपये {remainingAmountWords} मात्र) पंजीकरण के समय देय होगी।

3. विक्रय {saleDeadline} दिनों के भीतर पूरा किया जाएगा।

4. यदि क्रेता समय पर विक्रय पूरा नहीं करता है तो बयाना राशि जब्त हो जाएगी।

5. यदि विक्रेता विक्रय पूरा नहीं करता है तो वह दोगुनी राशि लौटाएगा।

{specialTerms}`,

    shop_lease: `यह वाणिज्यिक दुकान पट्टा समझौता {date} को {place} में किया गया है।

के बीच

1. {lessorName}, पुत्र {firstPartyFather}, निवासी {firstPartyAddress} (जिन्हें "पट्टादाता" कहा जाएगा) प्रथम पक्ष।

और

2. {lesseeName}, पुत्र {secondPartyFather}, निवासी {secondPartyAddress} (जिन्हें "पट्टादाता" कहा जाएगा) द्वितीय पक्ष।

अब यह समझौता निम्नलिखित शर्तों पर हुआ है:

1. पट्टादाता {shopAddress} पर स्थित दुकान {leasePeriod} वर्ष के लिए पट्टे पर देता है।

2. मासिक किराया ₹{monthlyRent} (रुपये {monthlyRentWords} मात्र) होगा।

3. किराया प्रति वर्ष {rentIncrease}% बढ़ेगा।

4. पट्टादाता 3 माह का सुरक्षा जमा देगा।

5. बिजली, पानी और रखरखाव का खर्च पट्टादाता वहन करेगा।

{specialTerms}`,

    vehicle_sale: `यह वाहन विक्रय एवं हस्तांतरण समझौता {date} को {place} में किया गया है।

के बीच

1. {sellerName}, पुत्र {firstPartyFather}, निवासी {firstPartyAddress} (जिन्हें "विक्रेता" कहा जाएगा) प्रथम पक्ष।

और

2. {buyerName}, पुत्र {secondPartyFather}, निवासी {secondPartyAddress} (जिन्हें "क्रेता" कहा जाएगा) द्वितीय पक्ष।

अब यह समझौता निम्नलिखित शर्तों पर हुआ है:

1. विक्रेता वाहन का स्वामित्व क्रेता को हस्तांतरित करता है।

2. क्रेता ने आज पूरी बिक्री राशि ₹{salePrice} का भुगतान कर दिया है।

3. विक्रेता सभी मूल दस्तावेज क्रेता को सौंपता है।

4. विक्रेता आरटीओ में पंजीकरण हस्तांतरण में सहायता करेगा।

{specialTerms}`,

    partnership: `यह व्यापार साझेदारी समझौता {date} को {place} में किया गया है।

के बीच

1. {partner1Name}, पुत्र {firstPartyFather}, निवासी {firstPartyAddress} (जिन्हें "प्रथम साझेदार" कहा जाएगा)।

और

2. {partner2Name}, पुत्र {secondPartyFather}, निवासी {secondPartyAddress} (जिन्हें "द्वितीय साझेदार" कहा जाएगा)।

अब यह साझेदारी विलेख निम्नलिखित शर्तों पर हुआ है:

1. फर्म का नाम {businessName} होगा।

2. व्यवसाय {businessAddress} से संचालित होगा।

3. पूंजी योगदान ₹{capitalContribution} होगा।

4. लाभ-हानि {profitRatio} के अनुपात में बांटे जाएंगे।

5. प्रत्येक साझेदार को प्रबंधन में समान अधिकार होंगे।

{specialTerms}`,

    event: `यह ईवेंट प्रबंधन सेवा समझौता {date} को {place} में किया गया है।

के बीच

1. {clientName}, पुत्र {firstPartyFather}, निवासी {firstPartyAddress} (जिन्हें "ग्राहक" कहा जाएगा) प्रथम पक्ष।

और

2. {eventManager}, पुत्र {secondPartyFather}, निवासी {secondPartyAddress} (जिन्हें "सेवा प्रदाता" कहा जाएगा) द्वितीय पक्ष।

अब यह समझौता निम्नलिखित शर्तों पर हुआ है:

1. सेवा प्रदाता {eventType} के लिए पूर्ण ईवेंट प्रबंधन सेवाएं प्रदान करेगा।

2. कुल सेवा लागत ₹{totalCost} (रुपये {totalCostWords} मात्र) होगी।

3. ग्राहक ने ₹{advanceAmount} अग्रिम भुगतान किया है।

4. शेष राशि ईवेंट से 7 दिन पहले देय होगी।

{specialTerms}`,

    mortgage: `यह संपत्ति बंधक/गिरवी समझौता {date} को {place} में किया गया है।

के बीच

1. {mortgagorName}, पुत्र {firstPartyFather}, निवासी {firstPartyAddress} (जिन्हें "बंधककर्ता" कहा जाएगा) प्रथम पक्ष।

और

2. {mortgageeName}, पुत्र {secondPartyFather}, निवासी {secondPartyAddress} (जिन्हें "बंधकग्राही" कहा जाएगा) द्वितीय पक्ष।

अब यह समझौता निम्नलिखित शर्तों पर हुआ है:

1. बंधककर्ता {propertyAddress} पर स्थित संपत्ति बंधक रखता है।

2. ऋण राशि ₹{loanAmount} पर {interestRate}% ब्याज लगेगा।

3. ऋण {repaymentPeriod} माह में चुकाया जाएगा।

{specialTerms}`,

    goods: `यह माल आपूर्ति समझौता {date} को {place} में किया गया है।

के बीच

1. {supplierName}, पुत्र {firstPartyFather}, निवासी {firstPartyAddress} (जिन्हें "आपूर्तिकर्ता" कहा जाएगा) प्रथम पक्ष।

और

2. {buyerName}, पुत्र {secondPartyFather}, निवासी {secondPartyAddress} (जिन्हें "क्रेता" कहा जाएगा) द्वितीय पक्ष।

अब यह समझौता निम्नलिखित शर्तों पर हुआ है:

1. आपूर्तिकर्ता {goodsDesc} की {quantity} इकाइयां आपूर्ति करेगा।

2. यूनिट मूल्य ₹{unitPrice} है। कुल मूल्य ₹{totalValue} होगा।

3. डिलीवरी {deliverySchedule} के अनुसार होगी।

{specialTerms}`,

    loan: `यह वित्तीय ऋण समझौता {date} को {place} में किया गया है।

के बीच

1. {lenderName}, पुत्र {firstPartyFather}, निवासी {firstPartyAddress} (जिन्हें "ऋणदाता" कहा जाएगा) प्रथम पक्ष।

और

2. {borrowerName}, पुत्र {secondPartyFather}, निवासी {secondPartyAddress} (जिन्हें "उधारकर्ता" कहा जाएगा) द्वितीय पक्ष।

अब यह समझौता निम्नलिखित शर्तों पर हुआ है:

1. ऋणदाता ₹{loanAmount} का ऋण उधारकर्ता को देता है।

2. ऋण पर {interestRate}% वार्षिक ब्याज लगेगा।

3. उधारकर्ता {tenure} मासिक किस्तों में ₹{emiAmount} प्रति माह चुकाएगा।

{specialTerms}`,

    vehicle_rent: `यह वाहन किराया समझौता {date} को {place} में किया गया है।

के बीच

1. {ownerName}, पुत्र {firstPartyFather}, निवासी {firstPartyAddress} (जिन्हें "स्वामी" कहा जाएगा) प्रथम पक्ष।

और

2. {hirerName}, पुत्र {secondPartyFather}, निवासी {secondPartyAddress} (जिन्हें "किरायेदार" कहा जाएगा) द्वितीय पक्ष।

अब यह समझौता निम्नलिखित शर्तों पर हुआ है:

1. स्वामी {vehicleDetails} वाहन किराए पर देता है।

2. किराया ₹{rentalAmount} प्रति {rentalPeriod} होगा।

3. किरायेदार ने ₹{securityDeposit} सुरक्षा जमा दी है।

{specialTerms}`
};

// Field configurations
const agreementFields = {
    rent: ["ownerName", "tenantName", "propertyAddress", "monthlyRent", "depositAmount", "rentPeriod", "startDate"],
    bayana: ["sellerName", "buyerName", "landAddress", "totalAmount", "advanceAmount", "saleDeadline"],
    shop_lease: ["lessorName", "lesseeName", "shopAddress", "monthlyRent", "leasePeriod", "rentIncrease"],
    vehicle_sale: ["sellerName", "buyerName", "vehicleDetails", "salePrice", "vehicleYear"],
    partnership: ["partner1Name", "partner2Name", "businessName", "businessAddress", "profitRatio", "capitalContribution"],
    event: ["clientName", "eventManager", "eventType", "eventDate", "eventVenue", "totalCost", "advanceAmount"],
    mortgage: ["mortgagorName", "mortgageeName", "propertyAddress", "loanAmount", "interestRate", "repaymentPeriod"],
    goods: ["supplierName", "buyerName", "goodsDesc", "quantity", "unitPrice", "deliverySchedule"],
    loan: ["borrowerName", "lenderName", "loanAmount", "interestRate", "emiAmount", "tenure"],
    vehicle_rent: ["ownerName", "hirerName", "vehicleDetails", "rentalAmount", "rentalPeriod", "securityDeposit"]
};

const fieldLabels = {
    ownerName: "Owner/Landlord Name", tenantName: "Tenant Name", propertyAddress: "Property Address", monthlyRent: "Monthly Rent (₹)", depositAmount: "Security Deposit (₹)", rentPeriod: "Rent Period (Months)", startDate: "Start Date",
    sellerName: "Seller Name", buyerName: "Buyer Name", landAddress: "Land/Property Address", totalAmount: "Total Amount (₹)", advanceAmount: "Advance Amount (₹)", saleDeadline: "Sale Deadline (Days)",
    lessorName: "Lessor/Owner Name", lesseeName: "Lessee/Tenant Name", shopAddress: "Shop Address", leasePeriod: "Lease Period (Years)", rentIncrease: "Annual Rent Increase (%)",
    vehicleDetails: "Vehicle Details (Make, Model, Reg No.)", salePrice: "Sale Price (₹)", vehicleYear: "Manufacturing Year",
    partner1Name: "First Partner Name", partner2Name: "Second Partner Name", businessName: "Business/Firm Name", businessAddress: "Business Address", profitRatio: "Profit Sharing Ratio (e.g., 50:50)", capitalContribution: "Capital Contribution (₹)",
    clientName: "Client Name", eventManager: "Event Manager/Company Name", eventType: "Event Type (Wedding/Conference/Birthday)", eventDate: "Event Date", eventVenue: "Event Venue Address", totalCost: "Total Service Cost (₹)",
    mortgagorName: "Mortgagor/Borrower Name", mortgageeName: "Mortgagee/Lender Name", loanAmount: "Loan Amount (₹)", interestRate: "Interest Rate (%)", repaymentPeriod: "Repayment Period (Months)",
    supplierName: "Supplier Name", goodsDesc: "Goods Description", quantity: "Quantity (in units)", unitPrice: "Unit Price (₹)", deliverySchedule: "Delivery Schedule (e.g., Within 15 days)",
    borrowerName: "Borrower Name", lenderName: "Lender Name", emiAmount: "EMI Amount (₹)", tenure: "Loan Tenure (Months)",
    hirerName: "Hirer Name", rentalAmount: "Rental Amount (₹ per day/month)", rentalPeriod: "Rental Period (e.g., 30 days)", securityDeposit: "Security Deposit (₹)"
};

// Agreement titles
const titlesEn = {
    rent: "RESIDENTIAL HOUSE RENT AGREEMENT",
    bayana: "LAND SALE ADVANCE (BAYANA) AGREEMENT",
    shop_lease: "COMMERCIAL SHOP LEASE AGREEMENT",
    vehicle_sale: "VEHICLE SALE & TRANSFER AGREEMENT",
    partnership: "BUSINESS PARTNERSHIP AGREEMENT",
    event: "EVENT MANAGEMENT SERVICE AGREEMENT",
    mortgage: "PROPERTY MORTGAGE/PLEDGE AGREEMENT",
    goods: "GOODS SUPPLY AGREEMENT",
    loan: "FINANCIAL LOAN/DEBT AGREEMENT",
    vehicle_rent: "VEHICLE HIRE/RENTAL AGREEMENT"
};

const titlesHi = {
    rent: "आवासीय किराया समझौता",
    bayana: "भूमि विक्रय अग्रिम (बयाना) समझौता",
    shop_lease: "वाणिज्यिक दुकान पट्टा समझौता",
    vehicle_sale: "वाहन विक्रय एवं हस्तांतरण समझौता",
    partnership: "व्यापार साझेदारी समझौता",
    event: "ईवेंट प्रबंधन सेवा समझौता",
    mortgage: "संपत्ति बंधक/गिरवी समझौता",
    goods: "माल आपूर्ति समझौता",
    loan: "वित्तीय ऋण समझौता",
    vehicle_rent: "वाहन किराया समझौता"
};

function getCurrentDate() {
    const date = document.getElementById('agreementDate').value;
    if (date) return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function numberToWords(num) {
    if (!num || isNaN(num) || num === 0) return "Zero";
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
    if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + numberToWords(num % 100) : "");
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");
    if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + numberToWords(num % 100000) : "");
    return numberToWords(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + numberToWords(num % 10000000) : "");
}

function selectAgreement(type) {
    currentAgreement = type;
    Object.keys(agreementFields).forEach(t => {
        const el = document.getElementById(`agree-${t}`);
        if (el) {
            if (t === type) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
    });
    loadDynamicFields();
    updatePreview();
    const title = currentLanguage === 'english' ? titlesEn[type] : titlesHi[type];
    showToast(`${title} selected`);
}

function loadDynamicFields() {
    const container = document.getElementById('dynamicFields');
    const fields = agreementFields[currentAgreement];
    let html = '<div class="space-y-2">';
    fields.forEach(field => {
        html += `
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">${fieldLabels[field]}</label>
                        <input type="text" id="${field}" oninput="updatePreview()" class="form-input w-full rounded-lg p-2 text-sm" placeholder="Enter ${fieldLabels[field]}">
                    </div>
                `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function setLanguage(lang) {
    currentLanguage = lang;
    document.getElementById('lang-en').classList.toggle('bg-blue-600', lang === 'english');
    document.getElementById('lang-en').classList.toggle('text-white', lang === 'english');
    document.getElementById('lang-hi').classList.toggle('bg-blue-600', lang === 'hindi');
    document.getElementById('lang-hi').classList.toggle('text-white', lang === 'hindi');
    updatePreview();
    showToast(`Language changed to ${lang === 'english' ? 'English' : 'हिंदी'}`);
}

function selectStamp(value) {
    currentStampValue = value;
    customStampData = null;
    ['10', '20', '50', '100'].forEach(v => {
        const el = document.getElementById(`stamp-${v}`);
        if (el) v === value ? el.classList.add('active') : el.classList.remove('active');
    });
    const stampImage = document.getElementById('stampPaperImage');
    stampImage.src = stampImages[value];
    stampImage.onload = function () {
        document.getElementById('stampImageContainer').style.display = 'block';
    };
    adjustStampTopSpace();
    showToast(`₹${value} Stamp Paper selected (Preview only)`);
}

function uploadCustomStamp() {
    const file = document.getElementById('customStampUpload').files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('File size should be less than 2MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = function (e) {
        customStampData = e.target.result;
        currentStampValue = 'custom';
        const stampImage = document.getElementById('stampPaperImage');
        stampImage.src = customStampData;
        stampImage.onload = function () {
            document.getElementById('stampImageContainer').style.display = 'block';
        };
        ['10', '20', '50', '100'].forEach(v => document.getElementById(`stamp-${v}`)?.classList.remove('active'));
        adjustStampTopSpace();
        showToast('Custom stamp uploaded successfully (Preview only)');
    };
    reader.readAsDataURL(file);
}

function removeStamp() {
    currentStampValue = null;
    customStampData = null;
    ['10', '20', '50', '100'].forEach(v => document.getElementById(`stamp-${v}`)?.classList.remove('active'));
    document.getElementById('stampImageContainer').style.display = 'none';
    document.getElementById('stampTopSpace').value = '1.0';
    document.getElementById('stampTopValue').innerText = '1.0';
    document.getElementById('stampSpaceDiv').style.height = '0px';
    showToast('Stamp paper removed');
}

function adjustStampTopSpace() {
    const value = parseFloat(document.getElementById('stampTopSpace').value);
    document.getElementById('stampTopValue').innerText = value;
    const pixels = value * 96;
    document.getElementById('stampSpaceDiv').style.height = pixels + 'px';
}

function changeFontSize(delta) {
    currentFontSize = Math.min(Math.max(currentFontSize + delta, 8), 16);
    document.getElementById('agreementText').style.fontSize = currentFontSize + 'pt';
    document.getElementById('fontSizeValue').innerText = currentFontSize + 'pt';
}

function resetFontSize() {
    currentFontSize = 11;
    document.getElementById('agreementText').style.fontSize = '11pt';
    document.getElementById('fontSizeValue').innerText = '11pt';
}

function updatePreview() {
    const templateBody = currentLanguage === 'english' ? agreementBodiesEn[currentAgreement] : agreementBodiesHi[currentAgreement];
    let bodyText = templateBody;

    const place = document.getElementById('placeCity').value || '[Place/City]';
    const specialTerms = document.getElementById('specialTerms').value;
    const fields = agreementFields[currentAgreement];

    // Get common party details
    const firstPartyFather = document.getElementById('firstPartyFather').value || '[Father Name]';
    const firstPartyAddress = document.getElementById('firstPartyAddress').value || '[Address]';
    const secondPartyFather = document.getElementById('secondPartyFather').value || '[Father Name]';
    const secondPartyAddress = document.getElementById('secondPartyAddress').value || '[Address]';

    bodyText = bodyText.replace(/{date}/g, getCurrentDate());
    bodyText = bodyText.replace(/{place}/g, place);
    bodyText = bodyText.replace(/{firstPartyFather}/g, firstPartyFather);
    bodyText = bodyText.replace(/{firstPartyAddress}/g, firstPartyAddress);
    bodyText = bodyText.replace(/{secondPartyFather}/g, secondPartyFather);
    bodyText = bodyText.replace(/{secondPartyAddress}/g, secondPartyAddress);

    fields.forEach(field => {
        const element = document.getElementById(field);
        let value = element ? element.value : '';
        if (value === '') value = `[${fieldLabels[field]}]`;

        if (field.includes('Amount') || field === 'monthlyRent' || field === 'depositAmount' || field === 'totalAmount' ||
            field === 'advanceAmount' || field === 'salePrice' || field === 'totalCost' || field === 'loanAmount' ||
            field === 'capitalContribution' || field === 'securityDeposit') {
            const numValue = parseInt(value.replace(/[^0-9]/g, ''));
            if (!isNaN(numValue) && numValue > 0) {
                bodyText = bodyText.replace(new RegExp(`{${field}Words}`, 'g'), numberToWords(numValue));
            } else {
                bodyText = bodyText.replace(new RegExp(`{${field}Words}`, 'g'), '');
            }
        }

        if (currentAgreement === 'goods' && field === 'unitPrice') {
            const quantity = document.getElementById('quantity')?.value || '0';
            const price = value || '0';
            const total = parseInt(quantity) * parseInt(price);
            if (!isNaN(total)) {
                bodyText = bodyText.replace(/{totalValue}/g, total.toLocaleString('en-IN'));
                bodyText = bodyText.replace(/{totalValueWords}/g, numberToWords(total));
            }
        }

        bodyText = bodyText.replace(new RegExp(`{${field}}`, 'g'), value);
        bodyText = bodyText.replace(new RegExp(`{${field}Words}`, 'g'), '');
    });

    if (currentAgreement === 'bayana') {
        const total = parseInt(document.getElementById('totalAmount')?.value) || 0;
        const advance = parseInt(document.getElementById('advanceAmount')?.value) || 0;
        const remaining = total - advance;
        bodyText = bodyText.replace(/{remainingAmount}/g, remaining.toLocaleString('en-IN'));
        bodyText = bodyText.replace(/{remainingAmountWords}/g, numberToWords(remaining));
    }

    if (specialTerms) {
        bodyText = bodyText.replace(/{specialTerms}/g, `\n\nSPECIAL TERMS & CONDITIONS:\n${specialTerms}`);
    } else {
        bodyText = bodyText.replace(/{specialTerms}/g, '');
    }

    const paragraphs = bodyText.split('\n\n');
    const title = currentLanguage === 'english' ? titlesEn[currentAgreement] : titlesHi[currentAgreement];
    let formattedHtml = `<h1>${title}</h1>`;

    paragraphs.forEach(para => {
        if (para.trim()) {
            if (para.trim().startsWith('THIS') || para.trim().startsWith('यह') ||
                para.trim().startsWith('BETWEEN') || para.trim().startsWith('के बीच') ||
                para.trim().startsWith('WHEREAS') || para.trim().startsWith('जहां') ||
                para.trim().startsWith('NOW') || para.trim().startsWith('अब')) {
                formattedHtml += `<h2>${para.trim()}</h2>`;
            } else if (para.trim().match(/^\d+\./)) {
                formattedHtml += `<p class="mb-2">${para.trim()}</p>`;
            } else {
                formattedHtml += `<p class="mb-2">${para.trim()}</p>`;
            }
        }
    });

    formattedHtml += `
                <div class="flex justify-between mt-8 pt-4">
                    <div>
                        <div class="signature-line"></div>
                        <div class="text-xs mt-1">Witness 1 Signature</div>
                        <div class="text-xs text-gray-500">(Name & Address)</div>
                    </div>
                    <div>
                        <div class="signature-line"></div>
                        <div class="text-xs mt-1">Witness 2 Signature</div>
                        <div class="text-xs text-gray-500">(Name & Address)</div>
                    </div>
                </div>
                <div class="flex justify-between mt-4">
                    <div>
                        <div class="signature-line"></div>
                        <div class="text-xs mt-1">First Party Signature</div>
                        <div class="text-xs text-gray-500">(${currentLanguage === 'english' ? 'With Date' : 'तारीख सहित'})</div>
                    </div>
                    <div>
                        <div class="signature-line"></div>
                        <div class="text-xs mt-1">Second Party Signature</div>
                        <div class="text-xs text-gray-500">(${currentLanguage === 'english' ? 'With Date' : 'तारीख सहित'})</div>
                    </div>
                </div>
                <div class="text-center text-xs text-gray-500 mt-6">
                    <p>${currentLanguage === 'english' ? 'IN WITNESS WHEREOF, the parties have signed this agreement on the date first mentioned above.' : 'उपरोक्त तिथि को पक्षकारों द्वारा इस समझौते पर हस्ताक्षर किए गए।'}</p>
                </div>
            `;

    document.getElementById('agreementText').innerHTML = formattedHtml;
}

function autoFillExample() {
    // Set common party details
    document.getElementById('firstPartyFather').value = 'SHRI RAM PRASAD';
    document.getElementById('firstPartyAddress').value = 'H.No. 45, Civil Lines, New Delhi - 110001';
    document.getElementById('secondPartyFather').value = 'SHRI SURESH PRASAD';
    document.getElementById('secondPartyAddress').value = 'H.No. 123, Green Park, New Delhi - 110016';

    const examples = {
        ownerName: "RAMESH KUMAR", tenantName: "SURESH SHARMA", propertyAddress: "H.No. 123, Green Park, New Delhi", monthlyRent: "15000", depositAmount: "45000", rentPeriod: "11", startDate: "2024-04-15",
        sellerName: "RAJESH GUPTA", buyerName: "AMIT SINGH", landAddress: "Khasra No. 123, Village Green Park", totalAmount: "5000000", advanceAmount: "500000", saleDeadline: "90",
        lessorName: "MANOJ KUMAR", lesseeName: "VIKAS VERMA", shopAddress: "Shop No. 45, Connaught Place", leasePeriod: "5", rentIncrease: "10",
        vehicleDetails: "Honda City, DL 01 AB 1234", salePrice: "350000", vehicleYear: "2020",
        partner1Name: "RAHUL SHARMA", partner2Name: "NEHA GUPTA", businessName: "SHARMA & ASSOCIATES", businessAddress: "Connaught Place, Delhi", profitRatio: "50:50", capitalContribution: "500000",
        clientName: "ROHIT MEHTA", eventManager: "EVENT PLANNERS PVT LTD", eventType: "Wedding", eventDate: "2024-05-15", eventVenue: "Hotel Grand, Delhi", totalCost: "500000", advanceAmount: "100000",
        mortgagorName: "DINESH VERMA", mortgageeName: "BANK OF INDIA", propertyAddress: "H.No. 45, Civil Lines, Delhi", loanAmount: "1000000", interestRate: "12", repaymentPeriod: "24",
        supplierName: "RICE SUPPLIERS LTD", buyerName: "RETAIL MART PVT LTD", goodsDesc: "Premium Basmati Rice", quantity: "1000", unitPrice: "80", deliverySchedule: "Within 15 days",
        borrowerName: "SUNIL KUMAR", lenderName: "PRAKASH SINGH", loanAmount: "200000", interestRate: "10", emiAmount: "10000", tenure: "24",
        ownerName: "TAXI OWNER", hirerName: "TRAVEL AGENCY", vehicleDetails: "Toyota Innova, DL 02 CD 5678", rentalAmount: "1500", rentalPeriod: "30 days", securityDeposit: "10000"
    };

    agreementFields[currentAgreement].forEach(field => {
        const element = document.getElementById(field);
        if (element && examples[field]) {
            element.value = examples[field];
        } else if (element && field === 'startDate') {
            element.value = "2024-04-15";
        } else if (element && field === 'eventDate') {
            element.value = "2024-05-15";
        }
    });
    updatePreview();
    showToast('Example data filled successfully');
}

function resetForm() {
    if (confirm('Are you sure you want to reset all fields?')) {
        // Reset common party details
        document.getElementById('firstPartyFather').value = '';
        document.getElementById('firstPartyAddress').value = '';
        document.getElementById('secondPartyFather').value = '';
        document.getElementById('secondPartyAddress').value = '';

        // Reset agreement specific fields
        agreementFields[currentAgreement].forEach(field => {
            const element = document.getElementById(field);
            if (element) element.value = '';
        });
        document.getElementById('specialTerms').value = '';
        document.getElementById('placeCity').value = 'New Delhi';
        document.getElementById('agreementDate').value = '2024-04-08';
        removeStamp();
        resetFontSize();
        updatePreview();
        showToast('Form reset successfully');
    }
}

function printAgreement() {
    const agreementText = document.getElementById('agreementText').innerHTML;
    const stampSpaceHeight = document.getElementById('stampSpaceDiv').style.height;

    const printHtml = `<!DOCTYPE html><html><head><title>${currentLanguage === 'english' ? titlesEn[currentAgreement] : titlesHi[currentAgreement]}</title><style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Inter', Arial, sans-serif; padding: 0.5in; margin: 0; }
                .agreement-content { line-height: 1.6; font-size: 12pt; text-align: justify; }
                .agreement-content h1 { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 15px; }
                .agreement-content h2 { font-size: 13pt; font-weight: bold; margin-top: 15px; margin-bottom: 10px; }
                .signature-line { border-top: 1px solid #000; width: 200px; margin-top: 40px; padding-top: 8px; }
                .stamp-spacer { height: ${stampSpaceHeight}; }
                @page { size: A4; margin: 0.5in; }
            </style></head><body><div class="stamp-spacer"></div><div class="agreement-content">${agreementText}</div></body></html>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printHtml);
    printWindow.document.close();
    printWindow.print();
    showToast('Print dialog opened (Stamp image not included)');
}

function downloadPDF() {
    const agreementText = document.getElementById('agreementText').innerHTML;
    const stampSpaceHeight = document.getElementById('stampSpaceDiv').style.height;

    const pdfContainer = document.createElement('div');
    pdfContainer.style.padding = '20px';
    pdfContainer.style.backgroundColor = 'white';

    const spacer = document.createElement('div');
    spacer.style.height = stampSpaceHeight;
    pdfContainer.appendChild(spacer);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'agreement-content';
    contentDiv.style.fontFamily = "'Inter', Arial, sans-serif";
    contentDiv.style.lineHeight = "1.6";
    contentDiv.style.fontSize = "12pt";
    contentDiv.style.textAlign = "justify";
    contentDiv.innerHTML = agreementText;
    pdfContainer.appendChild(contentDiv);

    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${currentLanguage === 'english' ? titlesEn[currentAgreement] : titlesHi[currentAgreement]}_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    showToast('Generating PDF (Stamp image not included)...');
    html2pdf().set(opt).from(pdfContainer).save().then(() => showToast('PDF downloaded successfully')).catch(() => showToast('Error generating PDF', 'error'));
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').innerText = message;
    toast.classList.remove('hidden', 'bg-green-500', 'bg-red-500');
    toast.classList.add(type === 'success' ? 'bg-green-500' : 'bg-red-500');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    loadDynamicFields();
    updatePreview();
    adjustStampTopSpace();
});
