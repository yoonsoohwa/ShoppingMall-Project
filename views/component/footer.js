function Footer() {
  const footerText = `
    <div id="footer" class="p-3">
      <div class="footer-logo" style="font-size: 32px"><img src='https://ifh.cc/g/7vx729.png' style="width:130px"></div>
      <div class="footer-description mt-2">
        <p>
          Based on upcycling art, deconstruction and hybrid, 'RE:Birth' delivers messages of each season which metaphorically expressed via fashion defiantly and innovatively.<br/>
          This design process creates social value as well as aesthetic value.
          It is a designer LSD collection that sublimates awareness of sustainability into creation.
          We exist for those who enjoy sustainability.
        </p>
      </div>
      <hr>
      <div class="footer-info mt-4">
        <p>
          (주)엘리스<br/>
          Office. 2nd floor Seongsu-nak-nak-nak,48 Achasan-ro 17-gil, Seongdong-gu, Seoul<br/>
          Owner. Dong-hyeon Kim<br/>
          Call. 070-4633-2017<br/>
          Email. kdp@elice.io<br/>
          Git-Lab. <a href="https://kdt-gitlab.elice.io/sw_track/class_06/web_project/team02/shopping_project_2team" style="color: #808080">team2</a><br/>
          BUSINESS LICENSE: 123-45-67890<br/>
          Copyright ⓒ 2023 RE: Birth All rights reserved.<br/>
        </p>
      </div>
    </div>
  `;
  document.querySelector('#footer-container').innerHTML = footerText;
}
Footer();
