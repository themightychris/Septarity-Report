<?php

readfile('http://www3.septa.org/hackathon/NextToArrive/'. rawurlencode($_REQUEST["start_station"]) .'/'. rawurlencode($_REQUEST["end_station"]) .'/' . $_REQUEST["count"]);