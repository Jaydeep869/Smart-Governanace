<!-- wen can fix ui ux problem by changing z index of navbar as its z index is -1 it takes it at the top of all the dropdown things in the nav and we are not able to access it so making it positive it will allows dropdown things apper and accessible -->

<!-- fix css code for navabar in nav class -->

<!-- 
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 1;
  transition: var(--transition-default);
}
 -->

 <!-- for form conatiner cannot get much info but we can change a fix width that is given to percentage system-->

 <!--
  .form-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  width: 90%;
  margin: 2rem auto;
  transition: var(--transition-default);
}
 -->


<!-- DOM performance optimization -->
1.
for event delegation the problem is the event listener is attach to each btn but we can do this by use loop type of thing which will make it efficient using methods like e.target.matches() 

2. 
for request throttling there is a problem that user can call an api too many time in a short interval which will decrese its performance we can make a delay for each api call to some millisecond so that we can prevent this 

3.
optimizing dom operations there the problem is we are insering each task one by one which reduces performance insted of that we can use document fragment method to do so 