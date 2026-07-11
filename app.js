let step=1;
function next(){document.getElementById('step1').classList.add('hide');document.getElementById('step2').classList.remove('hide');bar.style.width='66%';}
function generate(){
const e=event.value,f=food.value,s=service.value,c=comments.value.trim();
review.value=`We recently hired Shreevallabh Caterers for our ${e}. The food was excellent (${f}/5), the service was outstanding (${s}/5), and the entire experience was smooth and professionally managed. ${c?c+' ':''}We highly recommend Shreevallabh Caterers for any special occasion.`;
step2.classList.add('hide');step3.classList.remove('hide');bar.style.width='100%';
}
function copyReview(){navigator.clipboard.writeText(review.value);alert('Review copied!');}
