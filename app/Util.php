<?php


namespace App;


class Util
{

    public static function generateDateBetween(string $cases)
    {
        switch($cases) {
            case "all":
                return null;
                break;
            case "current_month":
                return [date('Y-m-01'), date('Y-m-t')];
                break;
            case "last_month":
                return [date('Y-m-d', strtotime("first day of last month")), date('Y-m-d', strtotime("last day of last month"))];
                break;
            case "last_3_months":
                return [date('Y-m-d', strtotime("first day of -3 month")), date('Y-m-t') ];;
                break;
            default:
                return null;
        }
        return null;
    }

    public static function is_int_array(array $arr): bool
    {
        $flag = true;
        foreach($arr as $a) {
            if(!is_numeric($a)) {
                $flag = false;
                break;
            }
        }
        return $flag;
    }

    public static function slugify($text, string $divider = '-')
    {
        // replace non letter or digits by divider
        $text = preg_replace('~[^\pL\d]+~u', $divider, $text);

        // transliterate
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

        // remove unwanted characters
        $text = preg_replace('~[^-\w]+~', '', $text);

        // trim
        $text = trim($text, $divider);

        // remove duplicate divider
        $text = preg_replace('~-+~', $divider, $text);

        // lowercase
        $text = strtolower($text);

        if (empty($text)) {
            return 'n-a';
        }

        return $text;
    }
}
