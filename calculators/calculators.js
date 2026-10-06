(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const n = id => Math.max(0, Number.parseFloat($(id)?.value) || 0);
  const money = v => new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0}).format(Number.isFinite(v) ? v : 0);
  const money2 = v => new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:2}).format(Number.isFinite(v) ? v : 0);
  const num = (v, d=0) => Number.isFinite(v) ? v : d;
  const setResult = (main, rows) => {
    const m = document.querySelector('[data-result-main]'), b = document.querySelector('[data-result-breakdown]');
    if (m) m.innerHTML = main;
    if (b) b.innerHTML = rows.map(r => `<div class="result-row"><span>${r[0]}</span><strong>${r[1]}</strong></div>`).join('');
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // FY 2026-27 / AY 2027-28 common individual estimates.
  const oldSlabs = age => age === '60to79'
    ? [[300000,0],[200000,.05],[500000,.20],[Infinity,.30]]
    : age === '80plus'
      ? [[500000,0],[500000,.20],[Infinity,.30]]
      : [[250000,0],[250000,.05],[500000,.20],[Infinity,.30]];
  const newSlabs = [[400000,0],[400000,.05],[400000,.10],[400000,.15],[400000,.20],[400000,.25],[Infinity,.30]];

  function slabTax(taxable, slabs) {
    let rem = Math.max(0, taxable), tax = 0;
    for (const [band, rate] of slabs) {
      if (rem <= 0) break;
      const part = Math.min(rem, band);
      tax += part * rate;
      rem -= part;
    }
    return tax;
  }
  function taxOld(grossTotalIncome, deductions, age) {
    const taxable = Math.max(0, grossTotalIncome - 50000 - deductions);
    let tax = slabTax(taxable, oldSlabs(age));
    const rebate = taxable <= 500000 ? Math.min(tax, 12500) : 0;
    tax -= rebate;
    return { taxable, baseTax: tax, rebate, cess: tax * .04, total: tax * 1.04 };
  }
  function taxNew(grossTotalIncome) {
    const taxable = Math.max(0, grossTotalIncome - Math.min(75000, grossTotalIncome));
    const slab = slabTax(taxable, newSlabs);
    let tax = slab, rebate = 0, marginalRelief = 0;
    if (taxable <= 1200000) { rebate = Math.min(tax, 60000); tax -= rebate; }
    else if (taxable <= 1250000) {
      const excess = taxable - 1200000;
      if (tax > excess) { marginalRelief = tax - excess; tax = excess; }
    }
    return { taxable, baseTax: tax, slabTax: slab, rebate, marginalRelief, cess: tax * .04, total: tax * 1.04 };
  }
  function addTaxRows(rows, old, neu) {
    rows.push(['Old-regime taxable income', money(old.taxable)], ['New-regime taxable income', money(neu.taxable)], ['Old-regime tax incl. 4% cess', money(old.total)], ['New-regime tax incl. 4% cess', money(neu.total)]);
  }

  function emiCalc(P, annual, years) {
    const months = Math.max(1, Math.round(years * 12)), r = annual / 1200;
    const emi = r ? P * r * Math.pow(1+r, months) / (Math.pow(1+r, months)-1) : P / months;
    return {emi, months, total: emi * months, interest: Math.max(0, emi * months - P)};
  }

  function calc(id) {
    if (id === 'emi' || id === 'loan') {
      const P = n(id === 'emi' ? 'emiAmount' : 'loanAmount'), annual = n(id === 'emi' ? 'emiRate' : 'loanRate'), years = n(id === 'emi' ? 'emiYears' : 'loanYears');
      const x = emiCalc(P, annual, years);
      const feePct = n(id === 'emi' ? 'emiFee' : 'loanFee'), fee = P * feePct / 100, feeGst = fee * .18, upfront = fee + feeGst;
      setResult(money(x.emi) + '/month', [
        ['Loan principal', money(P)], ['Total interest', money(x.interest)], ['Total repayment', money(x.total)],
        ['Tenure', x.months + ' months'], ['Processing fee', money(fee)], ['GST on processing fee (18%)', money(feeGst)], ['Illustrative upfront fee incl. GST', money(upfront)]
      ]);
      return;
    }
    if (id === 'loan-eligibility') {
      const income=n('eligIncome'), existing=n('eligEmi'), rate=n('eligRate'), years=n('eligYears'), pct=Math.min(100,n('eligPct'))/100;
      const affordable=Math.max(0,income*pct-existing), x=emiCalc(1,rate,years), principal=x.emi?affordable/x.emi:affordable*years*12;
      setResult(money(principal), [['Maximum EMI budget',money(Math.max(0,income*pct))],['Existing EMIs',money(existing)],['New EMI capacity',money(affordable)],['FOIR / EMI-to-income cap',Math.round(pct*100)+'%'],['Illustrative tenure',years+' years'],['Indicative only','Actual lender policy varies']]);
      return;
    }
    if (id === 'sip') {
      const p=n('sipMonthly'), annual=n('sipRate'), years=n('sipYears'), step=n('sipStep'), initial=n('sipInitial'), inflation=n('sipInflation');
      const months=Math.max(1,Math.round(years*12)), r=annual/1200, sr=step/100, monthlyInfl=inflation/1200;
      let fv=initial, invested=initial, monthly=p;
      for(let m=1;m<=months;m++){
        fv += monthly; invested += monthly; fv *= (1+r);
        if(m%12===0) monthly *= (1+sr);
      }
      const real = fv / Math.pow(1+inflation/100, years);
      setResult(money(fv), [['Total invested',money(invested)],['Estimated gains',money(Math.max(0,fv-invested))],['Step-up per year',step+'%'],['Inflation-adjusted value (today’s ₹)',money(real)],['Investment period',years+' years'],['Assumed annual return',annual+'%']]);
      return;
    }
    if (id === 'income-tax' || id === 'old-vs-new-tax') {
      const income=n(id==='income-tax'?'taxIncome':'cmpIncome'), age=$(id==='income-tax'?'taxAge':'cmpAge').value;
      const hra=n(id==='income-tax'?'taxHra':'cmpHra'), d80c=Math.min(150000,n(id==='income-tax'?'tax80c':'cmp80c')), d80d=n(id==='income-tax'?'tax80d':'cmp80d'), nps=n(id==='income-tax'?'taxNps':'cmpNps'), other=n(id==='income-tax'?'taxOther':'cmpOther');
      const old=taxOld(income,hra+d80c+d80d+nps+other,age), neu=taxNew(income), diff=old.total-neu.total;
      setResult(diff>=0 ? money(diff)+' lower under New Regime' : money(-diff)+' lower under Old Regime', [['Gross total income',money(income)],['Old-regime deductions entered',money(hra+d80c+d80d+nps+other)],['Old-regime tax incl. cess',money(old.total)],['New-regime tax incl. cess',money(neu.total)],['Estimated difference',money(Math.abs(diff))],['New-regime standard deduction',money(75000)],['Old-regime standard deduction',money(50000)]]);
      return;
    }
    if (id === 'salary-tax') {
      const ctc=n('salCtc'), employerPf=n('salEmployerPf'), gratuity=n('salGratuity'), employeePf=n('salPf'), pt=n('salPt'), other=n('salOther'), old80c=Math.min(150000,employeePf+n('sal80cOther')), age=$('salAge').value, regime=$('salRegime').value;
      const gross=Math.max(0,ctc-employerPf-gratuity), taxableGross=gross, old=taxOld(taxableGross,old80c+n('sal80d')+n('salNps')+n('salHra')+other+pt,age), neu=taxNew(taxableGross), tax=regime==='old'?old.total:neu.total;
      const inHand=Math.max(0,gross-employeePf-pt-other-tax), monthly=inHand/12;
      setResult(money(monthly)+'/month', [['Annual CTC',money(ctc)],['Estimated gross salary',money(gross)],['Employee PF',money(employeePf)],['Professional tax',money(pt)],['Other payroll deductions',money(other)],['Income tax ('+(regime==='old'?'Old':'New')+' regime)',money(tax)],['Estimated annual in-hand',money(inHand)],['Estimated monthly in-hand',money(monthly)],['Other regime tax',money(regime==='old'?neu.total:old.total)]]);
      return;
    }
    if (id === 'hra') {
      const basic=n('hraBasic'), da=n('hraDa'), hra=n('hraReceived'), rent=n('hraRent'), months=Math.min(12,Math.max(0,n('hraMonths'))), city=$('hraCity').value, regime=$('hraRegime').value, fy=$('hraFy').value;
      const metro2026=['delhi','mumbai','kolkata','chennai','bengaluru','hyderabad','pune','ahmedabad'];
      const metro2025=['delhi','mumbai','kolkata','chennai'];
      const metro=(fy==='2026-27'?metro2026:metro2025).includes(city), pct=metro?.5:.4, salary=basic+da;
      const actual=hra*months, rentEx=Math.max(0,rent*months-salary*months*.10), cityLimit=salary*months*pct;
      const exempt=regime==='new'?0:Math.min(actual,rentEx,cityLimit), taxable=Math.max(0,actual-exempt);
      const cityName=$('hraCity').selectedOptions[0]?.textContent || city;
      setResult(money(exempt)+'/year', [['Tax regime',regime==='new'?'New – HRA exemption not available':'Old – HRA exemption considered'],['FY',fy],['City',esc(cityName)],['Actual HRA received',money(actual)],['Rent − 10% of Basic + eligible DA',money(rentEx)],['City-limit component ('+Math.round(pct*100)+'%)',money(cityLimit)],['Exempt HRA',money(exempt)],['Taxable HRA',money(taxable)]]);
      return;
    }
    if (id === 'capital-gains-tax') {
      const type=$('cgType').value, sale=n('cgSale'), cost=n('cgCost'), expenses=n('cgExpenses'), gain=Math.max(0,sale-cost-expenses), used=type==='ltcg'?n('cgUsed'):0, exemption=type==='ltcg'?Math.max(0,125000-used):0, taxable=Math.max(0,gain-exemption), rate=type==='ltcg'?.125:.20, tax=taxable*rate, cess=tax*.04;
      setResult(money(tax+cess), [['Net capital gain',money(gain)],['LTCG exemption used',type==='ltcg'?money(exemption):'Not applicable'],['Taxable gain',money(taxable)],['Headline rate',(rate*100)+'%'],['Health & education cess (4%)',money(cess)],['Estimated tax incl. cess',money(tax+cess)]]);
      return;
    }
    if (id === 'currency-converter') {
      const amount=n('fxAmount'), from=$('fxFrom').value, to=$('fxTo').value, rate=window.__fxRate;
      if(!Number.isFinite(rate)){setResult('Fetching latest rate…',[['From',from],['To',to],['Status','Waiting for reference-rate data']]);return;}
      const value=amount*rate;
      setResult(value.toLocaleString('en-IN',{maximumFractionDigits:4})+' '+to,[['Amount',amount.toLocaleString('en-IN')+' '+from],['Reference rate','1 '+from+' = '+rate.toFixed(6)+' '+to],['Rate date',window.__fxDate||'Latest available'],['Source',window.__fxSource||'Reference-rate provider']]);
      return;
    }
    if (id === 'age') {
      const dob=new Date($('ageDob').value+'T00:00:00'), as=new Date($('ageAsOf').value+'T00:00:00');
      if(isNaN(dob)||isNaN(as)||as<dob){setResult('Enter valid dates',[]);return;}
      let y=as.getFullYear()-dob.getFullYear(),m=as.getMonth()-dob.getMonth(),d=as.getDate()-dob.getDate();
      if(d<0){m--;d+=new Date(as.getFullYear(),as.getMonth(),0).getDate();} if(m<0){y--;m+=12;}
      let next=new Date(as.getFullYear(),dob.getMonth(),dob.getDate()); if(next<as)next.setFullYear(as.getFullYear()+1);
      const days=Math.ceil((next-as)/86400000);
      setResult(y+' years, '+m+' months, '+d+' days',[['Date of birth',dob.toLocaleDateString('en-IN')],['Age on',as.toLocaleDateString('en-IN')],['Next birthday',next.toLocaleDateString('en-IN')],['Days to next birthday',days+' days']]);
    }
  }

  async function loadFx() {
    const id='currency-converter';
    if(!document.querySelector('#fxFrom')) return;
    const from=$('fxFrom').value, to=$('fxTo').value;
    if(from===to){window.__fxRate=1;window.__fxDate=new Date().toISOString().slice(0,10);window.__fxSource='Same-currency conversion';calc(id);return;}
    window.__fxRate=undefined; calc(id);
    const urls=[`https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,`https://open.er-api.com/v6/latest/${encodeURIComponent(from)}`];
    for(const url of urls){
      try{
        const res=await fetch(url,{cache:'no-store'}); if(!res.ok) continue; const data=await res.json();
        const rate=data?.rates?.[to]; if(Number.isFinite(rate)){window.__fxRate=rate;window.__fxDate=data.date||new Date().toISOString().slice(0,10);window.__fxSource=url.includes('frankfurter')?'Frankfurter / ECB reference rates':'ExchangeRate-API reference rates';calc(id);return;}
      }catch(e){}
    }
    setResult('Rate unavailable',[['Status','Could not fetch a current reference rate'],['Tip','Check your internet connection and try again']]);
  }

  function bind() {
    const path=location.pathname.split('/').filter(Boolean), id=path[path.length-1]==='calculators'?null:path[path.length-2]==='calculators'?path[path.length-1]:null;
    if(!id) return;
    const btn=document.querySelector('[data-action="calculate"]'); if(btn) btn.addEventListener('click',()=>calc(id));
    const reset=document.querySelector('[data-action="reset"]'); if(reset) reset.addEventListener('click',()=>location.reload());
    document.querySelectorAll('.calc-field input,.calc-field select').forEach(el=>el.addEventListener('input',()=>{if(id!=='currency-converter')calc(id);}));
    if(id==='currency-converter'){
      ['fxFrom','fxTo'].forEach(k=>$(k)?.addEventListener('change',loadFx)); $('fxAmount')?.addEventListener('input',()=>calc(id));
      loadFx();
    }
    if(id==='age'){
      const today=new Date().toISOString().slice(0,10); $('ageAsOf').value=today; const d=new Date(); d.setFullYear(d.getFullYear()-30); $('ageDob').value=d.toISOString().slice(0,10);
    }
    calc(id);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
})();
