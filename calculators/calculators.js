
(function(){
  'use strict';
  const $=id=>document.getElementById(id), money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number.isFinite(n)?n:0);
  const num=id=>Math.max(0,parseFloat($(id)?.value)||0);
  const setResult=(main,rows)=>{const m=document.querySelector('[data-result-main]'),b=document.querySelector('[data-result-breakdown]'); if(m)m.innerHTML=main; if(b)b.innerHTML=rows.map(r=>'<div class="result-row"><span>'+r[0]+'</span><strong>'+r[1]+'</strong></div>').join('');};
  const annualTax=(income,ded,age)=>{
    const std=75000, taxable=Math.max(0,income-std);
    let tax=0, bands=age==='under60'?[[250000,0],[250000,.05],[500000,.20],[Infinity,.30]]:age==='60to79'?[[300000,0],[200000,.05],[500000,.20],[Infinity,.30]]:[[500000,0],[500000,.20],[Infinity,.30]];
    let rem=taxable; for(const [band,rate] of bands){if(rem<=0)break; const x=Math.min(rem,band); tax+=x*rate; rem-=x;}
    if(taxable<=500000)tax=Math.max(0,tax-12500);
    return {tax:tax*1.04,taxable};
  };
  const newTax=(income)=>{
    const taxable=Math.max(0,income-75000); let tax=0,rem=taxable;
    const bands=[[400000,0],[400000,.05],[400000,.10],[400000,.15],[400000,.20],[400000,.25],[Infinity,.30]];
    for(const [band,rate] of bands){if(rem<=0)break;const x=Math.min(rem,band);tax+=x*rate;rem-=x;}
    if(taxable<=1200000) tax=Math.max(0,tax-60000);
    return {tax:tax*1.04,taxable};
  };
  function calc(id){
    if(id==='emi'||id==='loan'){const P=num(id==='emi'?'emiAmount':'loanAmount'), annual=num(id==='emi'?'emiRate':'loanRate'), years=num(id==='emi'?'emiYears':'loanYears'), n=years*12,r=annual/1200,emi=r?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n,total=emi*n;setResult(money(emi)+'/month',[['Principal',money(P)],['Total interest',money(total-P)],['Total repayment',money(total)],['Tenure',years+' years']]);}
    else if(id==='loan-eligibility'){const income=num('eligIncome'),existing=num('eligEmi'),rate=num('eligRate'),years=num('eligYears'),pct=num('eligPct')/100,n=years*12,r=rate/1200,maxEmi=Math.max(0,income*pct-existing),P=r?maxEmi*(Math.pow(1+r,n)-1)/(r*Math.pow(1+r,n)):maxEmi*n;setResult(money(P),[['Estimated affordable EMI',money(maxEmi)],['Existing EMIs',money(existing)],['Tenure',years+' years'],['Note','Indicative only']]);}
    else if(id==='sip'){const p=num('sipMonthly'), annual=num('sipRate'), years=num('sipYears'), n=years*12,r=annual/1200,fv=r? p*((Math.pow(1+r,n)-1)/r)*(1+r):p*n, invested=p*n;setResult(money(fv),[['Amount invested',money(invested)],['Estimated returns',money(fv-invested)],['Investment period',years+' years'],['Assumed annual return',annual+'%']]);}
    else if(id==='income-tax'){const income=num('taxIncome'),ded=num('taxDed'),age=$('taxAge').value, old=annualTax(Math.max(0,income-ded),0,age), neu=newTax(income);setResult(money(neu.tax),[['New-regime taxable income',money(neu.taxable)],['Old-regime estimate',money(old.tax)],['New-regime estimate',money(neu.tax)],['New regime saving',money(Math.max(0,old.tax-neu.tax))]]);}
    else if(id==='old-vs-new-tax'){const income=num('cmpIncome'),ded=num('cmpDed'),age=$('cmpAge').value, old=annualTax(Math.max(0,income-ded),0,age), neu=newTax(income), diff=old.tax-neu.tax;setResult(diff>=0?money(diff)+' lower under new regime':money(-diff)+' lower under old regime',[['Old regime estimate',money(old.tax)],['New regime estimate',money(neu.tax)],['Difference',money(Math.abs(diff))]]);}
    else if(id==='salary-tax'){const gross=num('salGross'),pf=num('salPf'),other=num('salOther'),tax=newTax(Math.max(0,gross-pf-other)),take=Math.max(0,gross-pf-other-tax.tax);setResult(money(take/12)+'/month',[['Estimated annual take-home',money(take)],['Indicative income tax',money(tax.tax)],['Employee PF',money(pf)],['Other deductions',money(other)]]);}
    else if(id==='hra'){const basic=num('hraBasic'),da=num('hraDa'),hra=num('hraReceived'),rent=num('hraRent'),salary=basic+da,city=$('hraCity').value,actual=hra,rentEx=Math.max(0,rent*12-salary*12*.10),percent=salary*12*(city==='metro'?.50:.40),ex=Math.min(actual*12,rentEx,percent),taxable=Math.max(0,actual*12-ex);setResult(money(ex)+'/year',[['HRA received',money(actual*12)],['Rent minus 10% salary',money(rentEx)],['City-limit component',money(percent)],['Taxable HRA',money(taxable)]]);}
    else if(id==='capital-gains-tax'){const type=$('cgType').value,sale=num('cgSale'),cost=num('cgCost'),gain=Math.max(0,sale-cost),used=num('cgUsed'),exemption=type==='ltcg'?Math.max(0,125000-used):0,taxable=Math.max(0,gain-exemption),rate=type==='ltcg'?.125:.20,tax=taxable*rate*1.04;setResult(money(tax),[['Capital gain',money(gain)],['Taxable gain',money(taxable)],['Headline rate',(rate*100)+'%'],['After 4% cess',money(tax)]]);}
    else if(id==='currency-converter'){const amount=num('fxAmount'),rate=num('fxRate'),from=$('fxFrom').value,to=$('fxTo').value;setResult((amount*rate).toLocaleString('en-IN',{maximumFractionDigits:4})+' '+to,[['From',from],['To',to],['Rate','1 '+from+' = '+rate+' '+to],['Amount',amount.toLocaleString('en-IN')+' '+from]]);}
    else if(id==='age'){const dob=new Date($('ageDob').value+'T00:00:00'),as=new Date($('ageAsOf').value+'T00:00:00');if(isNaN(dob)||isNaN(as)||as<dob){setResult('Enter valid dates',[]);return;}let y=as.getFullYear()-dob.getFullYear(),m=as.getMonth()-dob.getMonth(),d=as.getDate()-dob.getDate();if(d<0){m--;d+=new Date(as.getFullYear(),as.getMonth(),0).getDate();}if(m<0){y--;m+=12;}const next=new Date(as.getFullYear(),dob.getMonth(),dob.getDate());if(next<as)next.setFullYear(as.getFullYear()+1);const days=Math.ceil((next-as)/86400000);setResult(y+' years, '+m+' months, '+d+' days',[['Date of birth',dob.toLocaleDateString('en-IN')],['Age on',as.toLocaleDateString('en-IN')],['Next birthday',next.toLocaleDateString('en-IN')],['Days to next birthday',days+' days']]);}
  }
  const path=location.pathname.split('/').filter(Boolean); const id=path[path.length-1]==='calculators'?null:path[path.length-2]==='calculators'?path[path.length-1]:null;
  if(id){const btn=document.querySelector('[data-action="calculate"]');if(btn)btn.addEventListener('click',()=>calc(id));const reset=document.querySelector('[data-action="reset"]');if(reset)reset.addEventListener('click',()=>location.reload());
    if(id==='age'){const today=new Date().toISOString().slice(0,10);$('ageAsOf').value=today;const y=new Date();y.setFullYear(y.getFullYear()-30);$('ageDob').value=y.toISOString().slice(0,10);}
  }
})();
